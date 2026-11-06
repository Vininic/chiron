import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  lead: string;
  milestone: string;
}

// No eyebrow/title here on purpose: the sidebar + topbar crumb already name
// the route by the time this renders, so repeating it a third time added
// nothing — the empty state's job is the message and the next action, not
// re-announcing what page you're on.
export default function EmptyPage({ icon: Icon, lead, milestone }: Props) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-2xl flex-col items-center justify-center text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary text-primary-foreground">
        <Icon className="h-6 w-6" />
      </div>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">{lead}</p>
      <div className="mt-6 rounded-full border border-border bg-card px-4 py-1.5 text-xs text-muted-foreground">
        {milestone}
      </div>
    </div>
  );
}
