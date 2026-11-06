import { useState } from "react";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import { useT } from "@/lib/i18n/I18nProvider";
import { useChiron } from "@/lib/study/store";
import { addSource } from "@/lib/study/service";
import { makeId } from "@/lib/study/types";
import {
  runIngestion, materializeDrafts, approveDraft, rejectDraft,
  type IngestionProgress, type Draft, type DraftDocument,
} from "@/lib/study/ingestion";
import type { GeneratedNode, GeneratedSection, GeneratedExercise, GeneratedCard } from "@/lib/study/ingestion/passes";
import { loadStudyPreferences } from "@/lib/study/preferences";

type Step = "form" | "loading" | "review";

function draftLabel(draft: Draft): string {
  switch (draft.kind) {
    case "node": return `Nó · ${(draft.data as GeneratedNode).title}`;
    case "section": return `Seção · ${(draft.data as GeneratedSection).title}`;
    case "exercise": return `Exercício · ${(draft.data as GeneratedExercise).promptMd.slice(0, 60)}`;
    case "card": return `Card · ${(draft.data as GeneratedCard).frontMd.slice(0, 60)}`;
    default: return draft.kind;
  }
}

export default function AddSourceDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const t = useT();
  const L = t.chiron.maps;
  const { index, lib, replaceIndex, replaceLib } = useChiron();

  const [step, setStep] = useState<Step>("form");
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("TypeScript");
  const [progress, setProgress] = useState<IngestionProgress | null>(null);
  const [doc, setDoc] = useState<DraftDocument | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [filesFetched, setFilesFetched] = useState(0);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setStep("form");
    setUrl("");
    setName("");
    setProgress(null);
    setDoc(null);
    setSelected(new Set());
    setError(null);
  }

  function close(next: boolean) {
    if (!next) reset();
    onOpenChange(next);
  }

  const stageLabel: Record<IngestionProgress["stage"], string> = {
    fetching: L.stageFetching, map: L.stageMap, sections: L.stageSections,
    exercises: L.stageExercises, cards: L.stageCards, done: L.stageDone,
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStep("loading");
    setError(null);
    const tempSourceId = makeId();
    const result = await runIngestion(tempSourceId, url.trim(), language, setProgress, loadStudyPreferences().githubToken || undefined);
    if (!result.ok) {
      setError(result.error ?? "Falha desconhecida ao gerar o rascunho");
      setStep("form");
      return;
    }
    setDoc(result.drafts);
    setFilesFetched(result.filesFetched);
    setSelected(new Set(result.drafts.drafts.map((d) => d.id)));
    setStep("review");
  }

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  function commit() {
    if (!doc) return;
    let finalDoc = doc;
    for (const draft of doc.drafts) {
      finalDoc = selected.has(draft.id) ? approveDraft(finalDoc, draft.id) : rejectDraft(finalDoc, draft.id);
    }
    if (getApprovedCount(finalDoc) === 0) {
      toast(L.noDrafts);
      return;
    }

    const { index: withSource, id: sourceId } = addSource(index, {
      kind: "repo",
      name: name.trim() || url.trim(),
      repoUrl: url.trim(),
      language,
      contentOrigin: "github_ingested",
    });
    const currentLib = lib(sourceId);
    const result = materializeDrafts(finalDoc, sourceId, withSource, currentLib, `Rascunho — ${new Date().toLocaleDateString()}`);
    replaceIndex(result.index);
    replaceLib(sourceId, result.lib);

    const total = result.counts.nodes + result.counts.sections + result.counts.exercises + result.counts.cards;
    toast(L.committed(total));
    close(false);
  }

  function getApprovedCount(d: DraftDocument): number {
    return d.drafts.filter((draft) => selected.has(draft.id)).length;
  }

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{L.addSourceDialogTitle}</DialogTitle>
          <DialogDescription>{L.addSourceDialogLead}</DialogDescription>
        </DialogHeader>

        {step === "form" && (
          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="src-url">{L.urlLabel}</Label>
              <Input id="src-url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder={L.urlPlaceholder} required autoFocus />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="src-name">{L.nameLabel}</Label>
                <Input id="src-name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="src-lang">{L.languageLabel}</Label>
                <Input id="src-lang" value={language} onChange={(e) => setLanguage(e.target.value)} />
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                <XCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => close(false)}>{L.cancel}</Button>
              <Button type="submit" disabled={!url.trim()}>{L.submit}</Button>
            </DialogFooter>
          </form>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center gap-3 py-10">
            <Loader2 className="h-6 w-6 animate-spin text-secondary" />
            <p className="text-sm text-muted-foreground">{progress ? stageLabel[progress.stage] : L.stageFetching}</p>
          </div>
        )}

        {step === "review" && doc && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">{L.draftSummary(doc.drafts.length, filesFetched)}</p>
            <div className="flex gap-2">
              <Button type="button" size="sm" variant="outline" onClick={() => setSelected(new Set(doc.drafts.map((d) => d.id)))}>
                {L.approveAll}
              </Button>
              <Button type="button" size="sm" variant="outline" onClick={() => setSelected(new Set())}>
                {L.rejectAll}
              </Button>
            </div>
            <ScrollArea className="h-72 rounded-md border border-border">
              <div className="space-y-1 p-2">
                {doc.drafts.map((draft) => (
                  <label
                    key={draft.id}
                    className="flex cursor-pointer items-start gap-2.5 rounded-md p-2 text-sm hover:bg-accent"
                  >
                    <Checkbox
                      checked={selected.has(draft.id)}
                      onCheckedChange={() => toggle(draft.id)}
                      className="mt-0.5"
                    />
                    <span className="min-w-0 flex-1 truncate text-card-foreground">{draftLabel(draft)}</span>
                    {selected.has(draft.id) && <CheckCircle2 className="h-4 w-4 shrink-0 text-secondary" />}
                  </label>
                ))}
              </div>
            </ScrollArea>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => close(false)}>{L.cancel}</Button>
              <Button type="button" onClick={commit}>{L.addToChiron}</Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
