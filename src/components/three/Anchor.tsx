import { lazy, Suspense, useEffect, useState } from "react";
import { ChironMark } from "@/components/ChironLogo";
import { cn } from "@/lib/utils";

const Armillary = lazy(() => import("@/components/three/Armillary"));

/** Does this browser actually have a usable WebGL context? Checked once, at
 *  module level on first call, by really creating a context rather than
 *  sniffing `window.WebGLRenderingContext` — the constructor exists on plenty
 *  of setups where context creation still fails (blocklisted drivers,
 *  hardware acceleration off, headless). */
let webglOk: boolean | null = null;
function hasWebGL(): boolean {
  if (webglOk !== null) return webglOk;
  try {
    const canvas = document.createElement("canvas");
    webglOk = !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    webglOk = false;
  }
  return webglOk;
}

/** The identity anchor, with the *only* two legitimate reasons to fall back to
 *  the flat mark: the user asked for reduced motion, or WebGL isn't available.
 *
 *  The login page previously rendered a 160px 2D mark unconditionally, so the
 *  3D piece — the one thing that gives the app a face on the first screen a
 *  user ever sees — never ran there at all. That was the bug this component
 *  exists to make impossible to repeat: pages ask for "the anchor", not for
 *  "the canvas or the fallback", so no page gets to quietly choose the
 *  fallback for everyone. */
export default function Anchor({ className }: { className?: string }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion || !hasWebGL()) {
    return (
      <div className={cn("grid h-full w-full place-items-center", className)}>
        <ChironMark className="h-2/5 w-2/5 max-h-40 max-w-40 text-secondary-soft opacity-90" />
      </div>
    );
  }

  return (
    <div className={cn("h-full w-full", className)}>
      <Suspense fallback={null}>
        <Armillary />
      </Suspense>
    </div>
  );
}
