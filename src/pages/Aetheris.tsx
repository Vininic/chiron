import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Check, Copy, FileText, History, LayoutList, Loader2, PanelRightClose, PanelRightOpen,
  Send, Settings2, Sparkles, Square, Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import Markdown from "@/components/Markdown";
import { ChironMark } from "@/components/ChironLogo";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useChiron } from "@/lib/study/store";
import { streamChat, type ChatMessage } from "@/lib/ai/providers";
import {
  DEFAULT_MODELS, PROVIDER_LABELS, loadAiSettings, saveAiSettings,
  type AiProvider, type AiSettings,
} from "@/lib/ai/settings";
import { buildSystemPrompt, estimateTokens } from "@/lib/ai/context";
import { cn } from "@/lib/utils";

type Tab = "overview" | "digest" | "history";

interface UiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

// Rough context-window budget for the UI meter — most hosted/free models this
// suite targets sit around 32k-128k tokens; 32k is a conservative shared floor
// so the meter reads as "getting full" before any provider actually truncates.
const CONTEXT_BUDGET_TOKENS = 32_000;

function makeId(): string {
  return crypto.randomUUID();
}

export default function Aetheris() {
  const { dict: t, locale } = useI18n();
  const A = t.chiron.aetheris;
  const { index } = useChiron();

  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [streamingText, setStreamingText] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [tab, setTab] = useState<Tab>("overview");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AiSettings>(loadAiSettings);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const updateSettings = (patch: Partial<AiSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    saveAiSettings(next);
  };

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
    if (!trimmed || sending) return;

    setDraft("");
    setSending(true);
    setStreamingText("");

    const userMsg: UiMessage = { id: makeId(), role: "user", content: trimmed, timestamp: new Date().toISOString() };
    const history = [...messages, userMsg];
    setMessages(history);

    const chatMessages: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content }) as ChatMessage),
    ];

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      let full = "";
      await streamChat(settings, chatMessages, (delta) => {
        full += delta;
        setStreamingText(full);
      }, controller.signal);
      setMessages((prev) => [...prev, { id: makeId(), role: "assistant", content: full, timestamp: new Date().toISOString() }]);
    } catch (err) {
      const message = err instanceof Error ? err.message : "unknown error";
      setMessages((prev) => [...prev, { id: makeId(), role: "assistant", content: `${A.errorPrefix}${message}`, timestamp: new Date().toISOString() }]);
    } finally {
      setStreamingText(null);
      setSending(false);
      abortRef.current = null;
    }
  }, [draft, sending, messages, systemPrompt, settings, A.errorPrefix]);

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
      <header className="mb-4 flex shrink-0 items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-secondary">{A.eyebrow}</div>
            <h1 className="font-display mt-1 text-2xl text-primary">{A.title}</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSettingsOpen((o) => !o)}
            className={cn(
              "grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-muted-foreground transition-colors hover:text-foreground",
              settingsOpen && "border-secondary text-secondary",
            )}
            aria-label={A.provider}
          >
            <Settings2 className="h-4 w-4" />
          </button>
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

      {settingsOpen && (
        <div className="mb-4 flex shrink-0 flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-4">
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            {A.provider}
            <select
              value={settings.provider}
              onChange={(e) => updateSettings({ provider: e.target.value as AiProvider, model: "" })}
              className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
            >
              {Object.entries(PROVIDER_LABELS).map(([id, label]) => (
                <option key={id} value={id}>{label}</option>
              ))}
            </select>
          </label>
          {settings.provider !== "gemini-hosted" && settings.provider !== "openrouter-hosted" && settings.provider !== "ollama" && (
            <label className="flex flex-1 flex-col gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
              {A.apiKey}
              <input
                type="password"
                value={settings.apiKey}
                onChange={(e) => updateSettings({ apiKey: e.target.value })}
                placeholder="sk-…"
                className="rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
              />
            </label>
          )}
          <label className="flex flex-col gap-1 text-[10px] uppercase tracking-widest text-muted-foreground">
            {A.model}
            <input
              value={settings.model}
              onChange={(e) => updateSettings({ model: e.target.value })}
              placeholder={DEFAULT_MODELS[settings.provider]}
              className="w-48 rounded-md border border-border bg-surface-raised px-2 py-1.5 text-sm text-foreground"
            />
          </label>
          {(settings.provider === "gemini-hosted" || settings.provider === "openrouter-hosted") && (
            <p className="text-[11px] text-secondary">{A.hostedNote}</p>
          )}
        </div>
      )}

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
              <span>{PROVIDER_LABELS[settings.provider]} · {settings.model.trim() || DEFAULT_MODELS[settings.provider]}</span>
              <span className="num" title={`${usedTokens} ${A.tokensEstimate}`}>
                {contextPct}% {A.contextUsage} · {usedTokens.toLocaleString()} {A.tokensEstimate}
              </span>
            </div>
            <div className="mx-auto flex w-full max-w-3xl items-end gap-2 rounded-lg border border-border bg-surface-raised p-2">
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
              {sending ? (
                <Button type="button" size="icon" variant="outline" className="h-9 w-9 shrink-0" onClick={stopGenerating} aria-label={A.stopSpeaking}>
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button type="button" size="icon" className="h-9 w-9 shrink-0" onClick={sendMessage} disabled={!draft.trim()} aria-label={A.send}>
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

            {tab === "digest" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-border bg-surface-raised p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Resumo dos estudos</div>
                  <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                    <p>• {index.nodes.length} nós no mapa</p>
                    <p>• {index.sources.length} fontes</p>
                    <p>• {index.score.total} pontos</p>
                  </div>
                </div>
              </div>
            )}

            {tab === "history" && (
              <div className="space-y-2">
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <ChironMark className="mx-auto h-6 w-6 text-secondary/50" />
                  <p className="mt-3 text-xs text-muted-foreground">{A.historyEmpty}</p>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
