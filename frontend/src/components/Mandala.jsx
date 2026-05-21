/**
 * Mandala SVG décoratif — lotus traditionnel à plusieurs anneaux.
 * Pur SVG, aucune dépendance.
 */
export default function Mandala({
  size    = 300,
  color   = '#A67C52',
  opacity = 0.12,
  className = '',
  spin    = false,
  reverse = false,
}) {
  /* Helper : génère N ellipses réparties sur un cercle */
  const petals = (count, r, rx, ry, offset = 0) =>
    Array.from({ length: count }, (_, i) => (
      <g key={i} transform={`rotate(${i * (360 / count) + offset})`}>
        <ellipse cx={0} cy={-r} rx={rx} ry={ry} />
      </g>
    ));

  /* Helper : génère N lignes rayonnantes */
  const lines = (count, r1, r2, offset = 0) =>
    Array.from({ length: count }, (_, i) => (
      <line
        key={i}
        x1={0} y1={-r1}
        x2={0} y2={-r2}
        transform={`rotate(${i * (360 / count) + offset})`}
      />
    ));

  /* Helper : petits ronds sur un cercle */
  const dots = (count, r, dr = 1.5, offset = 0) =>
    Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        cx={0} cy={-r} r={dr}
        fill="currentColor"
        stroke="none"
        transform={`rotate(${i * (360 / count) + offset})`}
      />
    ));

  const spinClass = spin
    ? reverse ? 'animate-spin-reverse' : 'animate-spin-slow'
    : '';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      className={`${spinClass} ${className}`}
      style={{ color, opacity }}
      aria-hidden="true"
    >
      <g transform="translate(100,100)" strokeLinecap="round" strokeLinejoin="round">

        {/* ── Anneau extérieur ── */}
        <circle r="94" strokeWidth="0.8" />
        <circle r="89" strokeWidth="0.25" />

        {/* 16 micro-pétales tout à l'extérieur */}
        <g strokeWidth="0.5">{petals(16, 91, 2.5, 5)}</g>

        {/* 8 grands pétales de lotus externes */}
        <g strokeWidth="0.7">{petals(8, 73, 8, 18)}</g>

        {/* Lignes rayonnantes : anneau ext → anneau mid */}
        <g strokeWidth="0.25">{lines(16, 60, 89)}</g>

        {/* ── Anneau moyen ── */}
        <circle r="60" strokeWidth="0.7" />

        {/* 8 pétales médians (décalés de 22.5°) */}
        <g strokeWidth="0.7">{petals(8, 44, 9, 17, 22.5)}</g>

        {/* Petits losanges aux intersections */}
        <g strokeWidth="0.5">
          {Array.from({ length: 8 }, (_, i) => (
            <g key={i} transform={`rotate(${i * 45})`}>
              <path d="M0,-56 L3,-60 L0,-64 L-3,-60 Z" />
            </g>
          ))}
        </g>

        {/* Lignes rayonnantes : anneau mid → anneau int */}
        <g strokeWidth="0.25">{lines(8, 32, 60, 22.5)}</g>

        {/* ── Anneau intérieur ── */}
        <circle r="32" strokeWidth="0.7" />

        {/* 8 pétales intérieurs */}
        <g strokeWidth="0.7">{petals(8, 22, 6, 12)}</g>

        {/* ── Anneau central ── */}
        <circle r="13" strokeWidth="0.9" />
        <circle r="10" strokeWidth="0.3" />

        {/* 6 micro-pétales centraux */}
        <g strokeWidth="0.6">{petals(6, 8, 2.5, 5.5)}</g>

        {/* 8 points sur l'anneau central */}
        <g>{dots(8, 13, 1.2)}</g>

        {/* ── Centre ── */}
        <circle r="5" strokeWidth="1" />
        <circle r="2.5" fill="currentColor" stroke="none" />
        <circle r="1"   fill="none"        strokeWidth="0.8" />

      </g>
    </svg>
  );
}
