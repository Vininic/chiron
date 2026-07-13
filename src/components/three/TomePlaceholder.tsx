import { ChironMark } from "@/components/ChironLogo";

/** Placeholder for the 3D tome visualization. Will be replaced with a
 *  Three.js scene (a floating open book with particles) in a later milestone. */
export default function TomePlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="text-center">
        <ChironMark className="mx-auto h-28 w-28 text-secondary-soft opacity-80" />
        <p className="mt-4 text-xs uppercase tracking-[0.22em] text-secondary-soft/60">
          O tomo do conhecimento
        </p>
      </div>
    </div>
  );
}
