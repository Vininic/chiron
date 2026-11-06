import { useLocation } from "react-router-dom";
import { BookOpen, CircleHelp, Compass, LayoutDashboard, Repeat, Settings2, Sparkles, Target } from "lucide-react";
import { ChironMark } from "@/components/ChironLogo";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useT } from "@/lib/i18n/I18nProvider";

export default function Topbar() {
  const location = useLocation();
  const t = useT();
  const nav = t.chiron.nav;

  const crumb =
    location.pathname === "/dashboard" ? { icon: LayoutDashboard, label: nav.dashboard } :
    location.pathname === "/maps" ? { icon: Compass, label: nav.maps } :
    location.pathname.startsWith("/apostila") ? { icon: BookOpen, label: nav.apostila } :
    location.pathname === "/practice" ? { icon: Target, label: nav.practice } :
    location.pathname === "/review" ? { icon: Repeat, label: nav.review } :
    location.pathname === "/aetheris" ? { icon: Sparkles, label: nav.aetheris } :
    location.pathname === "/settings" ? { icon: Settings2, label: nav.settings } :
    location.pathname === "/about" ? { icon: CircleHelp, label: nav.about } :
    null;

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card/70 px-4 backdrop-blur lg:px-6">
      <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-secondary md:hidden">
        <ChironMark className="h-3.5 w-3.5" /> Chiron
      </div>

      {crumb && (
        <div className="hidden items-center gap-1.5 text-sm font-medium text-primary lg:flex">
          <crumb.icon className="h-3.5 w-3.5 text-secondary" /> {crumb.label}
        </div>
      )}

      <div className="ml-auto flex items-center gap-3">
        <LanguageToggle />
        <ThemeToggle />
      </div>
    </header>
  );
}
