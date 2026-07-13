import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { useAuth } from "@/lib/auth";
import type { ChironIndex, ChironLib } from "./types";
import { migrateIndex, migrateLib, freshIndex, freshLib } from "./migrate";
import { runSeed } from "./seeds";

const LOCAL_KEY = "chiron.data";
const SEED_FLAG = "chiron.seeded.v1";

interface ChironData {
  index: ChironIndex;
  libs: Record<string, ChironLib>;
}

function emptyData(): ChironData {
  return { index: freshIndex(), libs: {} };
}

interface ChironContextValue {
  index: ChironIndex;
  lib: (sourceId: string) => ChironLib;
  replaceIndex: (next: ChironIndex) => void;
  replaceLib: (sourceId: string, lib: ChironLib) => void;
  pushToCloud: () => Promise<void>;
  pullFromCloud: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const ChironCtx = createContext<ChironContextValue | null>(null);

function loadLocal(): ChironData {
  try {
    const seeded = localStorage.getItem(SEED_FLAG);
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw || !seeded) {
      const result = runSeed();
      localStorage.setItem(SEED_FLAG, "1");
      const data: ChironData = { index: result.index, libs: result.libs };
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
      return data;
    }
    const parsed = JSON.parse(raw) as ChironData;
    const hasIndex = parsed.index && Array.isArray(parsed.index.sources);
    if (!hasIndex) return emptyData();
    const version = parsed.index.version ?? 0;
    if (version < 1) {
      parsed.index = migrateIndex(parsed.index);
    }
    if (parsed.libs) {
      for (const key of Object.keys(parsed.libs)) {
        const libVersion = parsed.libs[key].version ?? 0;
        if (libVersion < 1) {
          parsed.libs[key] = migrateLib(parsed.libs[key], key);
        }
      }
    }
    return parsed;
  } catch {
    return emptyData();
  }
}

function saveLocal(data: ChironData) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
  } catch { /* noop */ }
}

export function ChironProvider({ children }: { children: ReactNode }) {
  const { session } = useAuth();
  const [data, setData] = useState<ChironData>(loadLocal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cloudFetched = useRef(false);

  useEffect(() => {
    saveLocal(data);
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
        setData(cloudData.value as ChironData);
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
        { key: "chiron-data", value: data, version: Date.now() },
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

  const lib = useCallback(
    (sourceId: string): ChironLib => data.libs[sourceId] ?? freshLib(sourceId),
    [data.libs],
  );

  const value = useMemo(
    () => ({ index: data.index, lib, replaceIndex, replaceLib, pushToCloud, pullFromCloud, loading, error }),
    [data.index, lib, replaceIndex, replaceLib, pushToCloud, pullFromCloud, loading, error],
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
