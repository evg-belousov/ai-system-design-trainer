/**
 * Owlary studio mark — single minimalist monoline owl.
 *
 * Ported from the Owlary brand (the studio that built System Design Trainer).
 * Rendered in `currentColor` so it inherits the trainer's own palette — we carry
 * the studio's *mark*, not its amber/dark theme (same approach as KOSMOSIGN).
 */
export function OwlMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 62"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* body */}
      <path d="M13 17C8 22 6 30 7 38C7.5 45 9 51 13 55Q30 60 47 55C51 51 53 45 53 38C54 30 52 22 47 17C42 13 18 13 13 17Z" />
      {/* brows curling into ear tufts */}
      <path d="M30 27C28 21 23 18 18 19C13 20 10 18 9.5 13C9 10 11.5 9 13 11" />
      <path d="M30 27C32 21 37 18 42 19C47 20 50 18 50.5 13C51 10 48.5 9 47 11" />
      {/* eyes */}
      <circle cx="20" cy="30" r="10" />
      <circle cx="40" cy="30" r="10" />
      <circle cx="21" cy="31" r="2.8" fill="currentColor" stroke="none" />
      <circle cx="39" cy="31" r="2.8" fill="currentColor" stroke="none" />
      {/* beak */}
      <path d="M30 31L27 35L30 39L33 35Z" />
      {/* belly */}
      <path d="M30 40L30 55" />
    </svg>
  );
}
