/**
 * A schematic guide (not a real hand outline) shown over the live camera
 * preview: an area for the palm-up hand and an area for the calibration
 * object, so both end up in frame, flat, and at a consistent angle.
 */
export function HandGuideOverlay({ side }: { side: "right" | "left" }) {
  const flip = side === "left";
  return (
    <svg
      className="capture-guide"
      viewBox="0 0 300 400"
      preserveAspectRatio="none"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      <g fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6">
        {/* palm */}
        <rect x="90" y="180" width="90" height="110" rx="26" />
        {/* fingers, palm-up, index (left, taller) and ring (right) emphasized */}
        <rect x="95" y="70" width="20" height="120" rx="10" />
        <rect x="120" y="55" width="20" height="135" rx="10" />
        <rect x="145" y="60" width="20" height="130" rx="10" />
        <rect x="170" y="75" width="18" height="115" rx="9" />
        {/* thumb */}
        <rect x="60" y="190" width="45" height="20" rx="10" transform="rotate(-25 82 200)" />
        {/* calibration object zone */}
        <rect x="70" y="320" width="160" height="55" rx="6" strokeDasharray="4 4" />
      </g>
      <text x="150" y="345" fill="white" fillOpacity="0.85" fontSize="12" textAnchor="middle">
        card / coin here
      </text>
      <text x="150" y="35" fill="white" fillOpacity="0.85" fontSize="12" textAnchor="middle">
        palm up, fingers relaxed
      </text>
    </svg>
  );
}
