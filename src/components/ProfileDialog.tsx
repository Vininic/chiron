import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar, Check, ChevronDown, ChevronRight, Cloud, Compass,
  FileJson, FileSpreadsheet, FileText, LogOut, MonitorSmartphone, Pencil,
  RotateCcw, Upload, X,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/lib/auth";
import { useChiron } from "@/lib/study/store";
import { computeMasteryWeight } from "@/lib/study/scoring";
import { cardsDue } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { downloadBackupJSON, downloadIndexXLSX, parseChironBackup } from "@/lib/study/export";
import { cardsToAnkiCards, downloadTSV } from "@/lib/anki/export";
import { useT } from "@/lib/i18n/I18nProvider";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function profileSnapshot(index: ReturnType<typeof useChiron>["index"]) {
  const todayStr = today();
  const dueSoon = [...index.cards]
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);
  const bySource = index.sources
    .map((s) => ({ source: s, count: index.nodes.filter((n) => n.sourceId === s.id).length }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);
  return {
    dueSoon,
    bySource,
    dueCount: cardsDue(index.cards, todayStr),
    masteryPct: Math.round(computeMasteryWeight(index.nodes) * 100),
  };
}

export default function ProfileDialog({ open, onOpenChange }: Props) {
  const { session, signOut, updateName } = useAuth();
  const { index, libs, resetAll, exportState, importState } = useChiron();
  const navigate = useNavigate();
  const t = useT();
  const P = t.chiron.profile;

  const [editing, setEditing] = useState(false);
  const [nameDraft, setNameDraft] = useState("");
  const [dataOpen, setDataOpen] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);

  const cloud = !!session?.email;
  const snap = useMemo(() => profileSnapshot(index), [index]);

  function startEditing() {
    setNameDraft(session?.name ?? "");
    setEditing(true);
  }
  function saveName() {
    const trimmed = nameDraft.trim();
    if (trimmed) void updateName(trimmed);
    setEditing(false);
  }

  function exportJson() {
    downloadBackupJSON(exportState());
    toast(P.exportedJson);
  }
  function exportAnki() {
    downloadTSV(cardsToAnkiCards(index.cards));
    toast(P.exportedAnki);
  }
  async function exportXlsx() {
    await downloadIndexXLSX(index, libs);
    toast(P.exportedXlsx);
  }
  function doReset() {
    resetAll();
    toast(P.resetDone);
  }
  async function importBackup(file: File | undefined) { if (!file) return; const parsed = parseChironBackup(await file.text()); if ("error" in parsed) { toast(parsed.error); return; } importState(parsed.value); toast("Backup importado"); }

  if (!session) return null;
  const initial = session.name.trim().charAt(0).toUpperCase() || "C";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-md gap-0 overflow-y-auto border-sidebar-border bg-sidebar p-0 text-sidebar-foreground">
        <div className="shrink-0 p-4 pb-3">
          <div className="flex items-center gap-3">
            <div className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-secondary text-base font-semibold text-secondary-foreground">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              {editing ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") saveName(); if (e.key === "Escape") setEditing(false); }}
                    className="w-36 rounded border border-sidebar-border bg-sidebar-accent/60 px-2 py-0.5 font-display text-sm text-sidebar-accent-foreground outline-none"
                  />
                  <button onClick={saveName} className="p-0.5 text-secondary hover:text-secondary/80"><Check className="h-3 w-3" /></button>
                  <button onClick={() => setEditing(false)} className="p-0.5 text-sidebar-foreground/50 hover:text-sidebar-foreground/80"><X className="h-3 w-3" /></button>
                </div>
              ) : (
                <div className="group flex items-center gap-2">
                  <span className="font-display truncate text-sm text-sidebar-accent-foreground">{session.name}</span>
                  <button onClick={startEditing} className="p-0.5 text-sidebar-foreground/40 opacity-0 transition-all hover:text-secondary/80 group-hover:opacity-100">
                    <Pencil className="h-2.5 w-2.5" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-sidebar-foreground/55">
                {cloud ? <Cloud className="h-2.5 w-2.5" /> : <MonitorSmartphone className="h-2.5 w-2.5" />}
                {cloud ? t.common.suiteAccount : t.common.thisBrowser}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 px-4 pb-4">
          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              <Calendar className="h-3 w-3 text-secondary" />
              {P.dueSoon}
              <span className="ml-auto num">{P.cardsCount(index.cards.length)}</span>
            </div>
            {snap.dueSoon.length === 0 ? (
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="min-w-[3rem] rounded border border-dashed border-sidebar-border px-2 py-1.5 text-center opacity-30">
                    <div className="text-[8px] text-sidebar-foreground/30">—</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {snap.dueSoon.map((c) => {
                  const overdue = c.dueDate <= today();
                  return (
                    <div
                      key={c.id}
                      className="flex items-center gap-1.5 rounded px-2.5 py-1"
                      style={{
                        backgroundColor: overdue ? "rgba(214,69,69,0.12)" : "hsl(var(--secondary)/0.1)",
                        border: `1px solid ${overdue ? "rgba(214,69,69,0.35)" : "hsl(var(--secondary)/0.3)"}`,
                      }}
                    >
                      <span className="max-w-[8rem] truncate text-[9px] font-medium text-sidebar-accent-foreground">{c.frontMd}</span>
                      <span className="num text-[8px] text-sidebar-foreground/50">{c.dueDate}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
            <div className="mb-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-sidebar-foreground/60">
              <Compass className="h-3 w-3 text-secondary" />
              {P.sources}
              <span className="ml-auto num">{index.sources.length}</span>
            </div>
            {snap.bySource.length === 0 ? (
              <div className="flex gap-1.5">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="min-w-[2.5rem] rounded border border-dashed border-sidebar-border px-2 py-2 opacity-30" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {snap.bySource.map(({ source, count }) => (
                  <div key={source.id} className="flex items-center gap-1.5 rounded border border-sidebar-border bg-sidebar/50 px-2.5 py-1">
                    <span className="max-w-[6rem] truncate text-[9px] text-sidebar-foreground/70">{source.name}</span>
                    <span className="num text-[8px] text-sidebar-foreground/40">{count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3 text-center">
              <div className="text-[9px] uppercase tracking-wider text-sidebar-foreground/50">{P.streak}</div>
              <div className="font-display num mt-0.5 text-base text-sidebar-accent-foreground">{index.score.streak}</div>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3 text-center">
              <div className="text-[9px] uppercase tracking-wider text-sidebar-foreground/50">{P.mastery}</div>
              <div className="font-display num mt-0.5 text-base text-sidebar-accent-foreground">{snap.masteryPct}%</div>
            </div>
            <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3 text-center">
              <div className="text-[9px] uppercase tracking-wider text-sidebar-foreground/50">{P.cards}</div>
              <div className="font-display num mt-0.5 text-base text-sidebar-accent-foreground">{index.cards.length}</div>
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-sidebar-border bg-sidebar-accent/30 p-3">
            <button
              type="button"
              onClick={() => setDataOpen(!dataOpen)}
              className="flex w-full items-center gap-2 py-1 text-left text-xs text-sidebar-foreground/80 transition-colors hover:text-sidebar-accent-foreground"
            >
              {dataOpen ? <ChevronDown className="h-3.5 w-3.5 text-secondary" /> : <ChevronRight className="h-3.5 w-3.5 text-secondary" />}
              <Upload className="h-3 w-3 text-secondary" />
              <span>{P.dataSection}</span>
            </button>
            {dataOpen && (
              <div className="space-y-2 pb-0.5 pt-1.5">
                <div className="flex flex-wrap gap-1.5">
                  <input ref={importInputRef} type="file" accept="application/json,.json" className="hidden" onChange={(event) => { void importBackup(event.target.files?.[0]); event.currentTarget.value = ""; }} />
                  <Button size="sm" variant="outline" className="h-7 flex-1 bg-sidebar/50 text-[10px]" onClick={() => importInputRef.current?.click()}>
                    <Upload className="mr-1 h-3 w-3 text-secondary" /> Importar
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 flex-1 bg-sidebar/50 text-[10px]" onClick={exportJson}>
                    <FileJson className="mr-1 h-3 w-3 text-amber-400" /> {P.exportJson}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 flex-1 bg-sidebar/50 text-[10px]" onClick={exportAnki}>
                    <FileText className="mr-1 h-3 w-3 text-secondary" /> {P.exportAnki}
                  </Button>
                  <Button size="sm" variant="outline" className="h-7 flex-1 bg-sidebar/50 text-[10px]" onClick={() => void exportXlsx()}>
                    <FileSpreadsheet className="mr-1 h-3 w-3 text-emerald-400" /> {P.exportXlsx}
                  </Button>
                </div>

                <div className="border-t border-sidebar-border" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-8 w-full bg-sidebar/50 text-xs"
                      style={{ borderColor: "rgba(214,69,69,0.35)", color: "rgba(224,120,105,0.9)" }}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> {P.resetConfirm}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{P.resetTitle}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {P.resetDesc}{cloud ? P.resetCloudSuffix : ""}. {P.resetIrreversible}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t.common.cancel}</AlertDialogCancel>
                      <AlertDialogAction onClick={doReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        {P.resetConfirm}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            className="h-9 w-full bg-sidebar/50 text-xs"
            style={{ borderColor: "rgba(178,58,46,0.4)", color: "rgba(224,120,105,1)" }}
            onClick={() => { void signOut(); navigate("/login"); onOpenChange(false); }}
          >
            <LogOut className="mr-1.5 h-3.5 w-3.5" /> {t.common.signOut}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
