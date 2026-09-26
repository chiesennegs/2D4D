/**
 * A schematic capture guide overlaid on the live camera preview.
 *
 * Anatomy note: this is drawn for a RIGHT hand, palm up, fingers pointing
 * away from the wrist (up the frame). In that pose the thumb sits on the
 * hand's OWN right side — i.e. rotate your right forearm from "palm down,
 * fingers away from you" (thumb points toward your body, the way it does
 * resting on a keyboard) through "handshake" (thumb up) to "palm up": the
 * thumb ends up pointing away from your body, not toward it. The reference
 * object also has to sit beside the hand, not below it, since the forearm
 * occupies the space below the wrist — and for a right hand reaching onto
 * a surface, the forearm approaches from the lower right, so the clearer
 * side is the hand's left.
 *
 * The left-hand guide mirrors the hand/card shapes (via an SVG transform,
 * not CSS, so only the shapes flip). Text stays upright and is positioned
 * explicitly per side instead of being mirrored, since mirroring text
 * renders it backwards.
 */
export function HandGuideOverlay({ side }: { side: "right" | "left" }) {
  const flip = side === "left";
  // Sized relative to the hand drawing below using its actual proportions
  // (card's 85.6 x 53.98mm long edge against a ~190mm hand length) — it was
  // previously drawn about 45% too large.
  const cardWidth = 78;
  const cardHeight = 124;
  const cardY = 154;
  const cardX = side === "right" ? 18 : 300 - 18 - cardWidth;
  const cardLabelX = cardX + cardWidth / 2;

  return (
    <svg className="capture-guide" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
      <g transform={flip ? "translate(300,0) scale(-1,1)" : undefined}>
        {/* soft fill silhouette, one group opacity so overlaps don't darken */}
        <g fill="white" opacity="0.22">
          <path d="M124,205 L116,160 A10,10 0 0 1 136,160 L152,205 Z" />
          <path d="M156,203 L155,89 A11,11 0 0 1 177,89 L188,203 Z" />
          <path d="M189,200 L194,63 A11,11 0 0 1 216,63 L221,200 Z" />
          <path d="M223,203 L238,92 A10,10 0 0 1 258,92 L253,203 Z" />
          <path d="M245,215 L282,191 A14,14 0 0 1 282,219 L245,249 Z" />
          <path d="M108,300 C104,258 108,218 118,199 C138,190 172,187 205,188 C230,189 248,195 256,206 C270,216 275,238 264,262 C257,282 248,296 236,308 C205,320 150,320 118,313 C110,311 106,305 108,300 Z" />
        </g>
        {/* crisp outline per finger/thumb, drawn after the fill so the tips read cleanly */}
        <g fill="none" stroke="white" strokeOpacity="0.85" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round">
          <path d="M124,205 L116,160 A10,10 0 0 1 136,160 L152,205" />
          <path d="M156,203 L155,89 A11,11 0 0 1 177,89 L188,203" />
          <path d="M189,200 L194,63 A11,11 0 0 1 216,63 L221,200" />
          <path d="M223,203 L238,92 A10,10 0 0 1 258,92 L253,203" />
          <path d="M245,215 L282,191 A14,14 0 0 1 282,219 L245,249" />
        </g>
        {/* palm outline on top, hiding the finger-base seams */}
        <path
          d="M108,300 C104,258 108,218 118,199 C138,190 172,187 205,188 C230,189 248,195 256,206 C270,216 275,238 264,262 C257,282 248,296 236,308 C205,320 150,320 118,313 C110,311 106,305 108,300 Z"
          fill="none"
          stroke="white"
          strokeOpacity="0.85"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </g>

      <rect x={cardX} y={cardY} width={cardWidth} height={cardHeight} rx="10" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6" />
      <text x={cardLabelX} y={cardY + cardHeight / 2 - 8} fill="white" fillOpacity="0.85" fontSize="12" textAnchor="middle">
        <tspan x={cardLabelX} dy="0">card /</tspan>
        <tspan x={cardLabelX} dy="14">coin</tspan>
        <tspan x={cardLabelX} dy="14">here</tspan>
      </text>
      <text x="150" y="24" fill="white" fillOpacity="0.9" fontSize="13" textAnchor="middle">
        palm up, fingers relaxed
      </text>
      <text x="150" y="380" fill="white" fillOpacity="0.9" fontSize="12" textAnchor="middle">
        both flat on the same surface
      </text>
    </svg>
  );
}
