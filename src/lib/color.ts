/** The suite's colour-wash chip primitive, centralised.
 *
 *  SUITE-ARCHITECTURE §3a is explicit that every app should pick one central
 *  helper for this from the start rather than copy-pasting `${hex}16` string
 *  suffixes around — Kairos has `alpha()` in `lib/color.ts`, Chronos has
 *  `safeKindStyle()`, Pluto inlines the trick and shouldn't. This is Chiron's
 *  one place. Use it for every chip, not just some. */

/** Alpha-suffixes a 6-digit hex. `n` is 0..1 and becomes the 8th/7th hex digit
 *  pair, so `alpha("#D64545", 0.09)` → `"#D6454517"`. Falls back to the input
 *  untouched for anything that isn't a plain `#rrggbb`, so a bad value degrades
 *  to an opaque colour rather than to an invalid one that renders as black. */
export function alpha(hex: string, n: number): string {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) return hex;
  const clamped = Math.max(0, Math.min(1, n));
  return `${hex}${Math.round(clamped * 255).toString(16).padStart(2, "0")}`;
}

/** The wash used by every chip in the app: tinted background + tinted border,
 *  the text/icon carrying the full colour. Never a coloured left-border stripe
 *  — that's explicitly not the family's block language. */
export function chipStyle(hex: string): { background: string; borderColor: string; color: string } {
  return { background: alpha(hex, 0.09), borderColor: alpha(hex, 0.2), color: hex };
}

/** Categorical chart scale — six curated hues mirroring `--chart-1..6` in
 *  index.css (light-mode values; dark mode is separately stepped there, not
 *  a flip of these). Deliberately independent of the brand accent: rubric is
 *  one series colour among six, because a chart coloured entirely in the
 *  accent can't distinguish anything. This exact hex set + order is the one
 *  that passes `dataviz` skill's validate_palette.js on both the light and
 *  dark chart surface (chroma floor, adjacent/normal-vision CVD ΔE,
 *  lightness band) — re-run the validator before changing any of these six
 *  or their order; the original slate/plum pair it replaced (2026-08-07)
 *  read as near-gray to the validator (chroma ~0.03-0.09, below the 0.1
 *  floor) despite looking like real "editorial muted" colours by eye. Ochre
 *  carries a sub-3:1 contrast WARN on the light surface — never the only
 *  cue on a mark using it; pair it with a direct label. */
export const CHART_HEX = {
  rubric: "#D64545",
  ironBlue: "#2E6FA8",
  verdigris: "#1F8F6D",
  violet: "#7A4FA0",
  ochre: "#C08A3E",
  rose: "#B2557A",
} as const;

export const CHART_SERIES: readonly string[] = [
  CHART_HEX.rubric,
  CHART_HEX.ironBlue,
  CHART_HEX.verdigris,
  CHART_HEX.violet,
  CHART_HEX.ochre,
  CHART_HEX.rose,
];

/** Mastery is a *sequence*, not a set of categories — unseen → learning →
 *  review → mastered is ordered, so it gets an ordered ramp (cool and dim to
 *  warm and bright), never six unrelated hues. Index matches `Mastery` 0..4.
 *  Reuses the validated `CHART_HEX` steps rather than duplicating hex, so the
 *  two scales can never drift apart. */
export const MASTERY_HEX: readonly string[] = [
  "#8A93A0", // 0 unseen    — neutral, recedes (not a chart-series hue on purpose)
  CHART_HEX.ironBlue, // 1 learning
  CHART_HEX.verdigris, // 2 review
  CHART_HEX.ochre, // 3 solid
  CHART_HEX.rubric, // 4 mastered — the only fully saturated step
];

/** Theme-safe versions of the above two scales, for anything painted live
 *  (SVG fill/stroke, inline style) rather than baked into a static asset —
 *  `hsl(var(--chart-1))` tracks the light/dark swap index.css already does,
 *  where the plain `CHART_HEX`/`MASTERY_HEX` strings above are frozen at
 *  their light-mode value forever. Use these two for chart marks; keep the
 *  hex versions for `alpha()`/`chipStyle()`, which need a real hex to slice
 *  a channel off of and can't operate on a `var()` reference. */
export const CHART_VARS: readonly string[] = [1, 2, 3, 4, 5, 6].map((n) => `hsl(var(--chart-${n}))`);

export const MASTERY_VARS: readonly string[] = [
  "hsl(var(--border))", // 0 unseen — same neutral role as the CSS border color, in both themes
  CHART_VARS[1], // 1 learning  — chart-2 (iron blue)
  CHART_VARS[2], // 2 review    — chart-3 (verdigris)
  CHART_VARS[4], // 3 solid     — chart-5 (ochre)
  CHART_VARS[0], // 4 mastered  — chart-1 (rubric)
];
