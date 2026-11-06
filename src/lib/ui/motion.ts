/** The manual "reduce motion" switch.
 *
 *  The suite's CSS already honours the OS-level `prefers-reduced-motion`. This
 *  is the in-app override for people whose system setting says one thing and
 *  who want the other here — it stamps `data-reduce-motion` on <html>, and one
 *  CSS rule in `index.css` keys off it with the same declarations the media
 *  query uses. Stored per browser, never synced: it is a property of the
 *  device you are looking at, not of the account. */

const KEY = "suite.reduce-motion";

export function readReduceMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function applyReduceMotion(enabled: boolean): void {
  if (typeof document === "undefined") return;
  if (enabled) document.documentElement.dataset.reduceMotion = "true";
  else delete document.documentElement.dataset.reduceMotion;
}

export function setReduceMotion(enabled: boolean): void {
  try { window.localStorage.setItem(KEY, enabled ? "1" : "0"); } catch { /* noop */ }
  applyReduceMotion(enabled);
}

/** Call once at boot, before first paint work matters. */
export function initReduceMotion(): void {
  applyReduceMotion(readReduceMotion());
}
