/**
 * Placeholder mark: two bars evoke the index (2nd) and ring (4th) fingers,
 * with the right bar taller — true for both sexes on average (2D:4D < 1),
 * so the shape itself doesn't encode a male/female-specific claim.
 * Swap this out freely; nothing else in the app depends on its internals.
 */
export function Logo({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" role="img" aria-label="2D4D logo">
      <defs>
        <linearGradient id="logo-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6ea8fe" />
          <stop offset="1" stopColor="#4b56d6" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="92" height="92" rx="22" fill="url(#logo-bg)" />
      <rect x="26" y="34" width="12" height="34" rx="6" fill="#0b1220" fillOpacity="0.92" />
      <rect x="58" y="22" width="12" height="46" rx="6" fill="#0b1220" fillOpacity="0.92" />
      <text x="32" y="84" textAnchor="middle" fontSize="15" fontWeight="700" fill="#eef1f6" fontFamily="Arial, Helvetica, sans-serif">
        2
      </text>
      <text x="64" y="84" textAnchor="middle" fontSize="15" fontWeight="700" fill="#eef1f6" fontFamily="Arial, Helvetica, sans-serif">
        4
      </text>
    </svg>
  );
}
