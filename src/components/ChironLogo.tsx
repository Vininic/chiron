import { cn } from "@/lib/utils";

/** The Chiron mark — an open book with a quill, representing the study of
 *  code. The book spreads at the center and the quill rests diagonally,
 *  crossed with arrows suggesting the bow of Chiron the centaur: knowledge
 *  aimed with precision. */
export function ChironMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("h-6 w-6", className)} aria-hidden>
      {/* open book — two pages */}
      <path d="M8 16 L32 8 L56 16 L56 52 L32 60 L8 52 Z" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" fill="none" />
      {/* spine */}
      <line x1="32" y1="8" x2="32" y2="60" stroke="currentColor" strokeWidth="3" />
      {/* left page text lines */}
      <line x1="16" y1="26" x2="28" y2="22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="32" x2="28" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="16" y1="38" x2="28" y2="34" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* right page text lines */}
      <line x1="36" y1="22" x2="48" y2="26" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="28" x2="48" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="36" y1="34" x2="48" y2="38" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* quill — diagonal across the book */}
      <path d="M18 52 L46 14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M46 14 L50 10 M46 14 L50 18 M46 14 L42 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* crossed arrows — centaur bow motif */}
      <path d="M8 16 L4 12 M8 16 L4 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M56 16 L60 12 M56 16 L60 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  variant?: "light" | "dark";
  className?: string;
}

export default function Logo({ variant = "dark", className }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <ChironMark className={variant === "light" ? "text-secondary-soft" : "text-secondary"} />
      <span
        className={cn(
          "font-display text-xl leading-none",
          variant === "light" ? "text-sidebar-foreground" : "text-primary",
        )}
      >
        Chiron
      </span>
    </div>
  );
}
