import type { AetherisAction } from "./actions";
import type { ChironIndex, ChironLib } from "@/lib/study/types";
export interface HistoryEntry { id: string; timestamp: string; descriptions: string[]; actions: AetherisAction[]; indexBefore?: ChironIndex; libsBefore?: Record<string, ChironLib>; undone: boolean; }
const KEY = "chiron.ai-history.v1";
export function loadHistory(): HistoryEntry[] { try { const result = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(result) ? result : []; } catch { return []; } }
function save(entries: HistoryEntry[]) { try { localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 30))); } catch { /* ignore */ } }
export function logHistory(actions: AetherisAction[], descriptions: string[], indexBefore: ChironIndex, libsBefore: Record<string, ChironLib>): HistoryEntry[] { const next = [{ id: crypto.randomUUID(), timestamp: new Date().toISOString(), descriptions, actions, indexBefore, libsBefore, undone: false }, ...loadHistory()]; save(next); return next; }
export function markHistoryUndone(entries: HistoryEntry[], id: string): HistoryEntry[] { return entries.map((entry) => entry.id === id ? { ...entry, undone: true } : entry); }
export function markUndone(id: string): HistoryEntry[] { const next = markHistoryUndone(loadHistory(), id); save(next); return next; }
