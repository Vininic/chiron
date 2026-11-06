import type { AetherisAction } from "./actions";
export interface UiMessage { id: string; role: "user" | "assistant"; content: string; timestamp: string; actions?: AetherisAction[]; }
export interface ChatSession { id: string; title: string; messages: UiMessage[]; createdAt: string; }

const KEY = "chiron.chat-sessions.v1";
const MAX_SESSIONS = 20;
const MAX_MESSAGES = 60;

export function newSession(): ChatSession { return { id: crypto.randomUUID(), title: "", messages: [], createdAt: new Date().toISOString() }; }
export function deriveTitle(message: string): string { const text = message.trim().replace(/\s+/g, " "); return text.length > 46 ? `${text.slice(0, 46)}…` : text; }
export function loadSessions(): ChatSession[] { try { const parsed = JSON.parse(localStorage.getItem(KEY) ?? "[]") as unknown; return Array.isArray(parsed) ? (parsed as ChatSession[]).slice(0, MAX_SESSIONS) : []; } catch { return []; } }
export function saveSessions(sessions: ChatSession[]): void { try { localStorage.setItem(KEY, JSON.stringify(sessions.slice(0, MAX_SESSIONS).map((session) => ({ ...session, messages: session.messages.slice(-MAX_MESSAGES) })))); } catch { /* local storage unavailable */ } }
