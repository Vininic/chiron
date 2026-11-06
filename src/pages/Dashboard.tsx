import { TrendingUp } from "lucide-react";
import EmptyPage from "@/components/EmptyPage";
import TodayStrip from "@/components/dashboard/TodayStrip";
import MainColumn from "@/components/dashboard/MainColumn";
import RightRail from "@/components/dashboard/RightRail";
import SourceCards from "@/components/dashboard/SourceCards";
import { useChiron } from "@/lib/study/store";
import { cardsDue } from "@/lib/study/srs";
import { today } from "@/lib/study/types";
import { useT } from "@/lib/i18n/I18nProvider";

export default function Dashboard() {
  const t = useT();
  const D = t.chiron.dashboard;
  const { index } = useChiron();

  const hasData = index.sources.length > 0;
  const dueCount = cardsDue(index.cards, today());

  if (!hasData) {
    return (
      <EmptyPage
        icon={TrendingUp}
        lead={D.noData}
        milestone="Adicione um repositório para começar"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        {index.sources.length} {index.sources.length === 1 ? "fonte" : "fontes"} · {index.nodes.length} nós · {dueCount} {dueCount === 1 ? "revisão hoje" : "revisões hoje"}
      </div>

      <TodayStrip />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <MainColumn />
        </div>
        <div>
          <RightRail />
        </div>
      </div>

      <SourceCards />
    </div>
  );
}
