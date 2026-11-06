import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import type { ChironIndex, ChironLib } from "./types";
import { freshLib } from "./migrate";
import { runSeed } from "./seeds";
import { restore, toPersisted, type ChironData, type PersistedV2 } from "./persistence";

const LOCAL_KEY = "chiron.data";
/** Pre-2026-10-23 flag; the seed is no longer stored, so it means nothing now. */
const LEGACY_SEED_FLAG = "chiron.seeded.v1";

// Built-in content comes from code on every load (persistence.ts explains
// why it must not be stored). Generated once per page; the store compares
// against it to persist only the person's own state.
let seedCache: ChironData | null = null;
function seed(): ChironData {
  seedCache ??= runSeed();
  return seedCache;
}

interface ChironContextValue {
  index: ChironIndex;
  lib: (sourceId: string) => ChironLib;
  libs: Record<string, ChironLib>;
  replaceIndex: (next: ChironIndex) => void;
  replaceLib: (sourceId: string, lib: ChironLib) => void;
  replaceAll: (index: ChironIndex, libs: Record<string, ChironLib>) => void;
  /** The person's own state, as persisted — what a backup file contains. */
  exportState: () => PersistedV2;
  /** Restores a backup in either the current or the pre-2026-10-23 format. */
  importState: (value: unknown) => void;
  resetAll: () => void;
  pushToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ChironCtx = createContext<ChironContextValue | null>(null);

function loadLocal(): ChironData {
  let raw: string | null = null;
  try { raw = localStorage.getItem(LOCAL_KEY); } catch { /* storage blocked: run on the seed */ }
  if (!raw) return seed();
  try {
    return restore(JSON.parse(raw), seed());
  } catch {
    // Unreadable document: keep the seed usable, never a blank app.
    return seed();
  }
}

function saveLocal(data: ChironData): string | null {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(toPersisted(data, seed())));
    localStorage.removeItem(LEGACY_SEED_FLAG);
    return null;
  } catch (err) {
    // Surfaced instead of swallowed: a silent failure here is exactly how
    // every reload used to discard the person's progress.
    return err instanceof Error ? err.message : "Falha ao salvar o progresso local";
  }
}

export function ChironProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [data, setData] = useState<ChironData>(loadLocal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cloudFetched = useRef(false);

  useEffect(() => {
    const failure = saveLocal(data);
    if (failure) setError(failure);
  }, [data]);

  useEffect(() => {
    if (session?.email && !cloudFetched.current) {
      cloudFetched.current = true;
      pullFromCloud();
    }
    if (!session?.email) {
      cloudFetched.current = false;
    }
  }, [session?.email]);

  async function pullFromCloud() {
    if (!session?.email) return;
    setLoading(true);
    setError(null);
    try {
      const supabase = (await import("@/lib/supabase/client")).getSupabaseClient();
      if (!supabase) return;
      const { data: cloudData, error: fetchError } = await supabase
        .from("user_data")
        .select("value")
        .eq("key", "chiron-data")
        .single();
      if (fetchError) {
        if (fetchError.code === "PGRST116") return;
        setError(fetchError.message);
        return;
      }
      if (cloudData?.value) {
        // Old rows hold the whole document with random ids; current rows hold
        // only progress. restore() accepts both.
        setData(restore(cloudData.value, seed()));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function pushToCloud() {
    if (!session?.email) return;
    setError(null);
    try {
      const supabase = (await import("@/lib/supabase/client")).getSupabaseClient();
      if (!supabase) return;
      const { error: upsertError } = await supabase.from("user_data").upsert(
        { key: "chiron-data", value: toPersisted(data, seed()), version: Date.now() },
        { onConflict: "user_id, key" },
      );
      if (upsertError) setError(upsertError.message);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  const replaceIndex = useCallback((next: ChironIndex) => {
    setData((prev) => ({ ...prev, index: next }));
  }, []);

  const replaceLib = useCallback((sourceId: string, lib: ChironLib) => {
    setData((prev) => ({
      ...prev,
      libs: { ...prev.libs, [sourceId]: lib },
    }));
  }, []);
  const replaceAll = useCallback((index: ChironIndex, libs: Record<string, ChironLib>) => setData({ index, libs }), []);
  const exportState = useCallback(() => toPersisted(data, seed()), [data]);
  const importState = useCallback((value: unknown) => setData(restore(value, seed())), []);

  // Reset clears the person's state; the built-in catalog is part of the app.
  const resetAll = useCallback(() => {
    setData(seed());
  }, []);

  const lib = useCallback(
    (sourceId: string): ChironLib => data.libs[sourceId] ?? freshLib(sourceId),
    [data.libs],
  );

  const value = useMemo(
    () => ({ index: data.index, lib, libs: data.libs, replaceIndex, replaceLib, replaceAll, exportState, importState, resetAll, pushToCloud, pullFromCloud, loading, error }),
    [data.index, data.libs, lib, replaceIndex, replaceLib, replaceAll, exportState, importState, resetAll, pushToCloud, pullFromCloud, loading, error],
  );

  return (
    <ChironCtx.Provider value={value}>
      {children}
    </ChironCtx.Provider>
  );
}

export function useChiron() {
  const ctx = useContext(ChironCtx);
  if (!ctx) throw new Error("useChiron must be used within ChironProvider");
  return ctx;
}
