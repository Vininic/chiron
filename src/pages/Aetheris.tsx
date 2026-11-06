import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Check, Copy, FileText, History, LayoutList, Loader2, PanelRightClose, PanelRightOpen,
  ChevronDown, FileUp, Plus, Send, Sparkles, Square, Trash2, Volume2, X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "@/components/Markdown";
import { ChironMark } from "@/components/ChironLogo";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useChiron } from "@/lib/study/store";
import { streamChat, type ChatMessage } from "@/lib/ai/providers";
import {
  DEFAULT_MODELS, PROVIDER_LABELS, loadAiSettings,
  type AiSettings,
} from "@/lib/ai/settings";
import { buildSystemPrompt, estimateTokens } from "@/lib/ai/context";
import { loadSessions, newSession, saveSessions, deriveTitle, type ChatSession, type UiMessage } from "@/lib/ai/chatSessions";
import { readAttachment, withAttachments, type FileAttachment } from "@/lib/ai/attachments";
import { applyAction, parseActions, type AetherisAction } from "@/lib/ai/actions";
import { heuristicDigest, aiDigest, type DigestCard } from "@/lib/ai/insight";
import { loadHistory, logHistory, markUndone, type HistoryEntry } from "@/lib/ai/actionHistory";
import ActionPill from "@/components/ActionPill";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type Tab = "overview" | "digest" | "history";

// Rough context-window budget for the UI meter — most hosted/free models this
// suite targets sit around 32k-128k tokens; 32k is a conservative shared floor
// so the meter reads as "getting full" before any provider actually truncates.
const CONTEXT_BUDGET_TOKENS = 32_000;

export default function Aetheris() {
  const { dict: t, locale } = useI18n();
  const A = t.chiron.aetheris;
  const { index, libs, replaceIndex, replaceLib } = useChiron();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sessions, setSessions] = useState<ChatSession[]>(() => { const saved = loadSessions(); return saved.length ? saved : [newSession()]; });
  const [activeSessionId, setActiveSessionId] = useState<string>(() => loadSessions()[0]?.id ?? "");
  const [draft, setDraft] = useState(() => searchParams.get("prompt") ?? "");

  // The reader's margin rail (F6) links here with a pre-filled question —
  // "Me questione sobre isso" etc. — via ?prompt=. Only prefills the
  // textbox, never auto-sends: arriving from another page shouldn't itself
  // trigger an AI call the person hasn't actually asked for yet. The param
  // is consumed once so it doesn't keep re-filling over an edited draft.
  useEffect(() => {
    if (searchParams.has("prompt")) {
      setSearchParams((p) => { p.delete("prompt"); return p; }, { replace: true });
    }
    // Only ever run this once, on the param that was present at mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("overview");
  const [settings, setSettings] = useState<AiSettings>(loadAiSettings);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [digest, setDigest] = useState<DigestCard[]>(() => heuristicDigest(index));
  const [digestAt, setDigestAt] = useState(() => new Date().toISOString());
  const [history, setHistory] = useState<HistoryEntry[]>(loadHistory);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const messages = activeSession?.messages ?? [];

  useEffect(() => { if (!activeSessionId && sessions[0]) setActiveSessionId(sessions[0].id); }, [activeSessionId, sessions]);
  const updateActive = useCallback((update: (session: ChatSession) => ChatSession) => {
    setSessions((current) => { const next = current.map((session) => session.id === activeSession?.id ? update(session) : session); saveSessions(next); return next; });
  }, [activeSession?.id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  // Estimated token usage of the whole conversation-so-far, incl. the system
  // prompt — a chars/4 heuristic, not the provider's real tokenizer; labeled
  // as an estimate in the UI rather than presented as an exact count.
  const systemPrompt = useMemo(() => buildSystemPrompt(index, locale === "en" ? "en" : "pt"), [index, locale]);
  const usedTokens = useMemo(() => {
    const convoText = messages.map((m) => m.content).join("\n") + (streamingText ?? "") + draft;
    return estimateTokens(systemPrompt) + estimateTokens(convoText);
  }, [systemPrompt, messages, streamingText, draft]);
  const contextPct = Math.min(100, Math.round((usedTokens / CONTEXT_BUDGET_TOKENS) * 100));

  const sendMessage = useCallback(async () => {
    const trimmed = draft.trim();
    if ((!trimmed && !attachments.length) || sending || !activeSession) return;

    setDraft("");
    setSending(true);
    setStreamingText("");

    const userMsg: UiMessage = { id: crypto.randomUUID(), role: "user", content: trimmed || "Anexo enviado", timestamp: new Date().toISOString() };
    const history = [...messages, userMsg];
    updateActive((session) => ({ ...session, title: session.title || deriveTitle(trimmed || attachments[0]?.name || "Nova conversa"), messages: history }));

    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m === userMsg ? withAttachments(m.content, attachments) : m.content }) as ChatMessage),
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let full = "";
      await streamChat(settings, chatMessages, (delta) => {
        full += delta;
        setStreamingText(full);
      }, controller.signal);
      const parsed = parseActions(full);
      updateActive((session) => ({ ...session, messages: [...session.messages, { id: crypto.randomUUID(), role: "assistant", content: parsed.prose, actions: parsed.actions, timestamp: new Date().toISOString() }] }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      updateActive((session) => ({ ...session, messages: [...session.messages, { id: crypto.randomUUID(), role: "assistant", content: `${A.errorPrefix}${message}`, timestamp: new Date().toISOString() }] }));
    } finally {
      setStreamingText(null);
      setSending(false);
      abortRef.current = null; setAttachments([]);
    }
  }, [draft, sending, messages, systemPrompt, settings, A.errorPrefix, activeSession, attachments, updateActive]);

  const createSession = () => { const next = newSession(); setSessions((current) => { const all = [next, ...current]; saveSessions(all); return all; }); setActiveSessionId(next.id); setDraft(""); };
  const deleteSession = (id: string) => setSessions((current) => { const next = current.filter((session) => session.id !== id); const safe = next.length ? next : [newSession()]; saveSessions(safe); setActiveSessionId(safe[0].id); return safe; });
  const acceptAction = (action: AetherisAction) => { const next = applyAction(index, libs, action); replaceIndex(next.index); for (const [sourceId, lib] of Object.entries(next.libs)) if (lib !== libs[sourceId]) replaceLib(sourceId, lib); setHistory(logHistory([action], ["Aetheris aplicou uma proposta"], index, libs)); };
  const undoHistory = (entry: HistoryEntry) => { if (entry.undone || !entry.indexBefore || !entry.libsBefore) return; replaceIndex(entry.indexBefore); for (const [sourceId, lib] of Object.entries(entry.libsBefore)) replaceLib(sourceId, lib); setHistory(markUndone(entry.id)); };
  const refreshDigest = async () => { const generated = await aiDigest(index, locale === "en" ? "English" : "Português do Brasil"); setDigest(generated ?? heuristicDigest(index)); setDigestAt(new Date().toISOString()); };
  const attach = async (files: FileList | null) => { for (const file of Array.from(files ?? [])) { const result = await readAttachment(file); if ("data" in result) setAttachments((current) => [...current, result]); } };

  const stopGenerating = () => abortRef.current?.abort();

  const toggleSpeak = (msg: UiMessage) => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    if (speakingId === msg.id) {
      synth.cancel();
      setSpeakingId(null);
      return;
    }
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(msg.content);
    utter.lang = locale === "en" ? "en-US" : "pt-BR";
    utter.onend = () => setSpeakingId(null);
    utter.onerror = () => setSpeakingId(null);
    setSpeakingId(msg.id);
    synth.speak(utter);
  };

  const copyMessage = async (msg: UiMessage) => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setCopiedId(msg.id);
      setTimeout(() => setCopiedId((id) => (id === msg.id ? null : id)), 1500);
    } catch { /* clipboard unavailable — no-op */ }
  };

  const tabs: { id: Tab; label: string; icon: typeof LayoutList }[] = [
    { id: "overview", label: A.tabOverview, icon: LayoutList },
    { id: "digest", label: A.tabDigest, icon: FileText },
    { id: "history", label: A.tabHistory, icon: History },
  ];

  const dueCount = index.cards.filter((c) => c.dueDate <= new Date().toISOString().slice(0, 10)).length;

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="mb-4 flex shrink-0 items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="relative min-w-0">
            <select value={activeSession?.id ?? ""} onChange={(event) => setActiveSessionId(event.target.value)} className="max-w-[250px] appearance-none rounded-lg border border-border bg-card py-2 pl-3 pr-8 text-sm text-card-foreground outline-none focus:ring-2 focus:ring-secondary/40">
              {sessions.map((session) => <option key={session.id} value={session.id}>{session.title || "Nova conversa"}</option>)}
            </select><ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <button type="button" onClick={createSession} className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground" aria-label="Nova conversa"><Plus className="h-4 w-4" /></button>
          {sessions.length > 1 && <button type="button" onClick={() => activeSession && deleteSession(activeSession.id)} className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-muted-foreground hover:text-destructive" aria-label="Apagar conversa"><Trash2 className="h-4 w-4" /></button>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setMobilePanelOpen(true)} className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-muted-foreground hover:text-foreground lg:hidden" aria-label="Abrir painel de estudo"><PanelRightOpen className="h-4 w-4" /></button>
          <button
            type="button"
            onClick={() => setSidebarOpen((o) => !o)}
            className="hidden h-9 w-9 items-center justify-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground lg:grid"
            aria-label={sidebarOpen ? A.tabHistory : A.tabOverview}
          >
            {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
          </button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 gap-5">
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card">
          <div className="flex flex-1 flex-col overflow-y-auto px-6 py-6">
            {messages.length === 0 && streamingText === null ? (
              <div className="flex flex-1 flex-col items-center justify-center text-center">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
                  <Sparkles className="h-6 w-6" />
                </div>
                <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{A.emptyLead}</p>
                <div className="mt-6 flex max-w-lg flex-wrap justify-center gap-2">
                  {A.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setDraft(s)}
                      className="rounded-full border border-border bg-surface-raised px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-secondary/40 hover:text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mx-auto w-full max-w-3xl space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={cn("group flex gap-3", msg.role === "assistant" && "flex-row-reverse")}>
                    <div className={cn(
                      "max-w-[80%] rounded-xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "border border-border bg-surface-raised text-primary",
                    )}>
                      {msg.role === "assistant" ? <Markdown text={msg.content} /> : <div>{msg.content}</div>}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 space-y-2 border-t border-border pt-3">
                          <div className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">Propostas</div>
                          {msg.actions.map((action, actionIndex) => <ActionPill key={actionIndex} action={action} index={index} onApply={() => acceptAction(action)} />)}
                        </div>
                      )}
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground/60">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                        <div className="ml-auto flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button type="button" onClick={() => copyMessage(msg)} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:text-foreground" aria-label={A.copy} title={A.copy}>
                            {copiedId === msg.id ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                          </button>
                          {msg.role === "assistant" && (
                            <button type="button" onClick={() => toggleSpeak(msg)} className="grid h-5 w-5 place-items-center rounded text-muted-foreground hover:text-foreground" aria-label={speakingId === msg.id ? A.stopSpeaking : A.speak} title={speakingId === msg.id ? A.stopSpeaking : A.speak}>
                              {speakingId === msg.id ? <Square className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {streamingText !== null && (
                  <div className="flex flex-row-reverse gap-3">
                    <div className="max-w-[80%] rounded-xl border border-border bg-surface-raised px-4 py-2.5 text-sm text-primary">
                      {streamingText ? <Markdown text={streamingText} /> : (
                        <span className="flex items-center gap-1.5 text-muted-foreground">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> {A.thinking}
                        </span>
                      )}
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div className="shrink-0 border-t border-border p-3">
            <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-1 pb-1.5 text-[10px] text-muted-foreground">
              <Link to="/settings" className="hover:text-foreground">
                via {PROVIDER_LABELS[settings.provider]} · {settings.model.trim() || DEFAULT_MODELS[settings.provider]}
              </Link>
              <span className="num" title={`${usedTokens} ${A.tokensEstimate}`}>
                {contextPct}% {A.contextUsage} · {usedTokens.toLocaleString()} {A.tokensEstimate}
              </span>
            </div>
            {attachments.length > 0 && <div className="mx-auto mb-2 flex w-full max-w-3xl flex-wrap gap-1.5">{attachments.map((attachment) => <span key={attachment.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2 py-1 text-[11px] text-muted-foreground">{attachment.name}<button type="button" onClick={() => setAttachments((items) => items.filter((item) => item.id !== attachment.id))} aria-label={`Remover ${attachment.name}`}><X className="h-3 w-3" /></button></span>)}</div>}
            <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-lg border border-border bg-surface-raised p-2">
              <input ref={fileInputRef} type="file" accept=".csv,.json,.md,.txt,text/plain,text/csv,application/json,text/markdown" multiple className="hidden" onChange={(event) => { void attach(event.target.files); event.currentTarget.value = ""; }} />
              <button type="button" onClick={() => fileInputRef.current?.click()} className="grid h-9 w-9 shrink-0 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground" aria-label="Anexar texto"><FileUp className="h-4 w-4" /></button>
              <Textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder={A.placeholder}
                rows={1}
                className="min-h-[2.5rem] flex-1 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
              />
              <select value={settings.autonomy} onChange={(event) => { const next = { ...settings, autonomy: event.target.value as AiSettings["autonomy"] }; setSettings(next); localStorage.setItem("chiron.ai-settings.v1", JSON.stringify(next)); }} className="hidden h-9 max-w-24 rounded-md border border-border bg-card px-1.5 text-[10px] text-muted-foreground sm:block" aria-label="Autonomia do Aetheris"><option value="review">Revisar</option><option value="auto">Auto</option></select>
              {sending ? (
                <Button type="button" size="icon" variant="outline" className="h-9 w-9 shrink-0" onClick={stopGenerating} aria-label={A.stopSpeaking}>
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button type="button" size="icon" className="h-9 w-9 shrink-0" onClick={sendMessage} disabled={!draft.trim() && !attachments.length} aria-label={A.send}>
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        <aside className={cn("hidden w-72 shrink-0 flex-col overflow-hidden rounded-xl border border-border bg-card lg:w-80", sidebarOpen && "lg:flex")}>
          <div className="flex shrink-0 border-b border-border">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => setTab(id)}
                className={cn(
                  "flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-2.5 text-xs font-medium transition-colors",
                  tab === id ? "border-secondary text-primary" : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5" /> {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {tab === "overview" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Sequência</div>
                  <div className="font-display mt-1 text-2xl text-primary">{index.score.streak}d</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Revisões pendentes</div>
                  <div className="font-display mt-1 text-2xl text-primary">{dueCount}</div>
                </div>
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Fontes de estudo</div>
                  <div className="font-display mt-1 text-2xl text-primary">{index.sources.length}</div>
                </div>
              </div>
            )}

            {tab === "digest" && <div className="space-y-3"><div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground"><span>Digest · {digest.some((card) => card.source === "IA") ? "IA" : "Estrutural"}</span><button type="button" onClick={() => { void refreshDigest(); }} className="text-secondary hover:underline">Atualizar</button></div>{digest.map((card, i) => <div key={`${card.title}-${i}`} className={cn("rounded-lg border p-3", card.severity === "warning" ? "border-destructive/25 bg-destructive/5" : "border-border bg-surface-raised")}><div className="text-sm font-medium text-card-foreground">{card.title}</div><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{card.body}</p></div>)}<div className="text-[10px] text-muted-foreground">Atualizado {new Date(digestAt).toLocaleTimeString()}</div></div>}

            {tab === "history" && <div className="space-y-2">{history.length ? history.map((entry) => <div key={entry.id} className="rounded-lg border border-border bg-surface-raised p-3"><div className="text-xs text-card-foreground">{entry.descriptions.join(" · ")}</div><div className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground"><span>{new Date(entry.timestamp).toLocaleString()}</span>{entry.undone ? <span>Desfeito</span> : entry.indexBefore ? <button type="button" onClick={() => undoHistory(entry)} className="text-secondary hover:underline">Desfazer</button> : <span>Sem snapshot</span>}</div></div>) : <div className="flex flex-col items-center justify-center py-8 text-center"><ChironMark className="mx-auto h-6 w-6 text-secondary/50" /><p className="mt-3 text-xs text-muted-foreground">{A.historyEmpty}</p></div>}</div>}
          </div>
        </aside>
      </div>
      <Sheet open={mobilePanelOpen} onOpenChange={setMobilePanelOpen}>
        <SheetContent side="bottom" className="max-h-[70vh] rounded-t-2xl border-border bg-card p-0 lg:hidden">
          <SheetTitle className="sr-only">Painel de estudo</SheetTitle>
          <div className="flex border-b border-border">{tabs.map(({ id, label, icon: Icon }) => <button key={id} type="button" onClick={() => setTab(id)} className={cn("flex flex-1 items-center justify-center gap-1.5 border-b-2 px-2 py-3 text-xs", tab === id ? "border-secondary text-primary" : "border-transparent text-muted-foreground")}><Icon className="h-3.5 w-3.5" />{label}</button>)}</div>
          <div className="max-h-[calc(70vh-48px)] overflow-y-auto p-4">{tab === "overview" && <div className="grid grid-cols-3 gap-2">{[["Sequência", `${index.score.streak}d`], ["Revisões", String(dueCount)], ["Fontes", String(index.sources.length)]].map(([label, value]) => <div key={label} className="rounded-lg border border-border bg-surface-raised p-3"><div className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</div><div className="font-display mt-1 text-xl text-primary">{value}</div></div>)}</div>}{tab === "digest" && <div className="space-y-2">{digest.map((card) => <div key={card.title} className="rounded-lg border border-border bg-surface-raised p-3"><div className="text-sm font-medium">{card.title}</div><p className="mt-1 text-xs text-muted-foreground">{card.body}</p></div>)}</div>}{tab === "history" && <div className="space-y-2">{history.length ? history.map((entry) => <div key={entry.id} className="rounded-lg border border-border p-3 text-xs">{entry.descriptions.join(" · ")}</div>) : <p className="py-8 text-center text-sm text-muted-foreground">{A.historyEmpty}</p>}</div>}</div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
