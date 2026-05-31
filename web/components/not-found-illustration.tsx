/** Decorative SVG: open book with a missing page — 404 / not found theme */
export function NotFoundIllustration({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="nf-book-cover" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8B2635" />
          <stop offset="100%" stopColor="#5C1823" />
        </linearGradient>
        <linearGradient id="nf-page-glow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#2A2A32" />
          <stop offset="100%" stopColor="#1A1A22" />
        </linearGradient>
        <filter id="nf-soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>

      <ellipse cx="160" cy="218" rx="110" ry="14" fill="#000" fillOpacity="0.35" />

      <path
        d="M48 52 C48 38 62 28 88 28 L120 28 L120 200 C88 200 48 188 48 168 Z"
        fill="url(#nf-book-cover)"
        filter="url(#nf-soft-shadow)"
      />
      <path d="M88 28 L120 28 L120 200 L100 198 C78 194 58 180 52 160 L52 48 Z" fill="#6B1F2E" fillOpacity="0.5" />

      <path
        d="M272 52 C272 38 258 28 232 28 L200 28 L200 200 C232 200 272 188 272 168 Z"
        fill="url(#nf-book-cover)"
        filter="url(#nf-soft-shadow)"
      />
      <path d="M232 28 L200 28 L200 200 L220 198 C242 194 262 180 268 160 L268 48 Z" fill="#6B1F2E" fillOpacity="0.5" />

      <rect x="118" y="28" width="84" height="172" rx="2" fill="#3D1219" />

      <path
        d="M124 40 L158 44 L158 188 L128 184 C124 182 122 170 122 150 L122 52 Z"
        fill="url(#nf-page-glow)"
      />
      <line x1="132" y1="72" x2="150" y2="74" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />
      <line x1="130" y1="92" x2="148" y2="94" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />
      <line x1="128" y1="112" x2="146" y2="114" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />

      <path
        d="M158 44 L182 48 L182 188 L158 188 Z"
        fill="#14141A"
        stroke="#C41E3A"
        strokeWidth="1.5"
        strokeDasharray="6 4"
        strokeOpacity="0.7"
      />
      <text
        x="170"
        y="118"
        textAnchor="middle"
        fill="#C41E3A"
        fontSize="22"
        fontWeight="700"
        fontFamily="system-ui, sans-serif"
        opacity="0.9"
      >
        ?
      </text>

      <path d="M182 48 L198 50 L198 188 L182 188 Z" fill="url(#nf-page-glow)" />
      <line x1="186" y1="72" x2="194" y2="73" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />
      <line x1="186" y1="92" x2="194" y2="93" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />
      <line x1="186" y1="112" x2="194" y2="113" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />
      <line x1="186" y1="132" x2="194" y2="133" stroke="#4A4A58" strokeWidth="2" strokeLinecap="round" />

      <path
        d="M168 28 L176 28 L174 72 L168 68 L162 72 L160 28 Z"
        fill="#C41E3A"
        opacity="0.85"
      />

      <g transform="translate(228 88) rotate(12)" opacity="0.55">
        <rect x="0" y="0" width="28" height="36" rx="2" fill="#2E2E38" stroke="#C41E3A" strokeWidth="1" strokeDasharray="3 2" />
        <line x1="6" y1="10" x2="22" y2="10" stroke="#5A5A68" strokeWidth="1.5" />
        <line x1="6" y1="18" x2="18" y2="18" stroke="#5A5A68" strokeWidth="1.5" />
      </g>

      <text
        x="160"
        y="118"
        textAnchor="middle"
        fill="#9CA3AF"
        fontSize="11"
        fontWeight="600"
        fontFamily="system-ui, sans-serif"
        letterSpacing="2"
      >
        404
      </text>
    </svg>
  );
}
