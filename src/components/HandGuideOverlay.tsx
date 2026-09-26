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
  const cardX = side === "right" ? 18 : 300 - 18 - 78;
  const cardLabelX = cardX + 39;

  return (
    <svg className="capture-guide" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
      <g transform={flip ? "translate(300,0) scale(-1,1)" : undefined}>
        <g fill="rgba(255,255,255,0.16)" stroke="white" strokeOpacity="0.75" strokeWidth="2" strokeLinejoin="round">
          {/* pinky */}
          <path d="M120,207 L133,213 Q145,213 145,224 L142,150 Q141,138 130,138 Q119,138 118,150 Z" />
          {/* ring */}
          <path d="M153,203 L182,203 Q182,192 178,192 L166,80 Q164,68 152,68 Q140,68 139,80 L152,192 Q153,198 153,203 Z" />
          {/* middle */}
          <path d="M186,200 L216,200 L203,54 Q201,42 190,42 Q179,42 178,54 L191,190 Q192,196 186,200 Z" />
          {/* index */}
          <path d="M219,204 L247,215 L253,90 Q253,78 242,76 Q231,75 228,86 L221,192 Q219,198 219,204 Z" />
          {/* thumb */}
          <path d="M226,232 Q222,220 232,213 L263,178 Q272,169 281,177 Q289,185 282,195 L253,231 Q244,242 232,239 Q227,237 226,232 Z" />
          {/* palm */}
          <path d="M113,214 Q112,206 121,206 L152,203 Q182,203 186,200 L220,203 Q234,205 233,220 L233,232 Q248,238 253,231 L257,255 Q259,278 240,290 Q210,304 170,303 Q131,301 116,282 Q107,270 108,250 Z" />
        </g>
      </g>

      <rect x={cardX} y="128" width="78" height="176" rx="12" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="6 6" />
      <text x={cardLabelX} y="208" fill="white" fillOpacity="0.85" fontSize="13" textAnchor="middle">
        <tspan x={cardLabelX} dy="0">card /</tspan>
        <tspan x={cardLabelX} dy="16">coin</tspan>
        <tspan x={cardLabelX} dy="16">here</tspan>
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
