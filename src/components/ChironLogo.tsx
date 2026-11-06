import { cn } from "@/lib/utils";

/** The Chiron mark — an armillary ring pair pierced by the centaur's arrow.
 *
 *  Replaces the previous open-book-plus-quill-plus-arrows mark (2026-07-29
 *  review): that one stacked three metaphors, and at favicon size the page
 *  lines and the quill collapsed into noise. This is four strokes that survive
 *  16px: the meridian circle, the tilted equator ellipse, the polar axis, and
 *  the fletching. The axis doubles as Chiron's arrow — in a real armillary the
 *  axis pierces the poles, so the bow reading and the instrument reading are
 *  the same geometry rather than two symbols sharing a frame.
 *
 *  Silhouette is a slashed circle: nothing else in the suite (or in the
 *  category — every study app on earth uses an open book) reads like it. */
export function ChironMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={cn("h-6 w-6", className)} aria-hidden>
      {/* meridian ring */}
      <circle cx="32" cy="32" r="22" stroke="currentColor" strokeWidth="3.5" />
      {/* equator ring, seen at an angle */}
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="7.5"
        stroke="currentColor"
        strokeWidth="3"
        transform="rotate(-20 32 32)"
      />
      {/* polar axis / arrow shaft, perpendicular to the equator */}
      <path d="M21.7 60.2 L42.3 3.8" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
      {/* arrowhead */}
      <path
        d="M35.4 9.6 L42.3 3.8 L43.9 12.7"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* fletching */}
      <path
        d="M18.0 57.1 L24.1 53.6 L26.5 60.2"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
