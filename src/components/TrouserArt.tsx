import type { Product } from "@/lib/products";

// A fleece jogger drawn as SVG — no product photos exist yet (no samples
// ordered), so the rail uses clean vector trousers in each colourway.
// `view` switches the front (drawstring + zip pocket) and back (plain).

export default function TrouserArt({
  product,
  view = "front",
  className = "",
}: {
  product: Product;
  view?: "front" | "back";
  className?: string;
}) {
  const { main, dark, stitch } = product;
  return (
    <svg viewBox="0 0 200 270" className={className} role="img" aria-label={`${product.name} in ${product.colour}`}>
      {/* legs + body */}
      <path
        d="M58 44 H142 L137 214 Q136 228 122 228 H112 Q103 228 102 218 L99 128 L97 108 L95 128 L92 218 Q91 228 82 228 H72 Q58 228 57 214 Z"
        fill={main}
      />
      {/* waistband */}
      <rect x="56" y="22" width="88" height="24" rx="5" fill={dark} />
      <line x1="56" y1="34" x2="144" y2="34" stroke={stitch} strokeWidth="1.5" />
      {view === "front" ? (
        <>
          {/* drawstring */}
          <line x1="94" y1="46" x2="90" y2="66" stroke="#e8e8e8" strokeWidth="3" strokeLinecap="round" />
          <line x1="106" y1="46" x2="110" y2="66" stroke="#e8e8e8" strokeWidth="3" strokeLinecap="round" />
          <circle cx="90" cy="68" r="2.5" fill="#e8e8e8" />
          <circle cx="110" cy="68" r="2.5" fill="#e8e8e8" />
          {/* side pocket seams */}
          <path d="M60 52 Q74 60 76 78" fill="none" stroke={stitch} strokeWidth="2" />
          <path d="M140 52 Q126 60 124 78" fill="none" stroke={stitch} strokeWidth="2" />
          {/* zip pocket, right thigh */}
          <rect x="112" y="96" width="5" height="26" rx="2.5" fill={dark} />
          <line x1="114.5" y1="98" x2="114.5" y2="120" stroke="#c9c9c9" strokeWidth="1" strokeDasharray="2 2" />
        </>
      ) : (
        <>
          {/* back pockets */}
          <rect x="70" y="58" width="22" height="18" rx="3" fill="none" stroke={stitch} strokeWidth="2" />
          <rect x="108" y="58" width="22" height="18" rx="3" fill="none" stroke={stitch} strokeWidth="2" />
          <line x1="100" y1="48" x2="100" y2="104" stroke={stitch} strokeWidth="1.5" />
        </>
      )}
      {/* ribbed ankle cuffs */}
      <rect x="58" y="206" width="36" height="22" rx="4" fill={dark} />
      <rect x="106" y="206" width="36" height="22" rx="4" fill={dark} />
      <line x1="62" y1="213" x2="90" y2="213" stroke={stitch} strokeWidth="1.5" />
      <line x1="62" y1="220" x2="90" y2="220" stroke={stitch} strokeWidth="1.5" />
      <line x1="110" y1="213" x2="138" y2="213" stroke={stitch} strokeWidth="1.5" />
      <line x1="110" y1="220" x2="138" y2="220" stroke={stitch} strokeWidth="1.5" />
      {/* centre seam */}
      <line x1="100" y1="108" x2="100" y2="200" stroke={stitch} strokeWidth="1" opacity="0.6" />
    </svg>
  );
}

// The hanger the trouser hangs from on the rail.
export function Hanger() {
  return (
    <svg viewBox="0 0 60 34" className="h-8 w-14 text-neutral-500" aria-hidden="true">
      <path d="M30 2 a5 5 0 0 1 5 5 v3 h-3 v-3 a2 2 0 0 0 -4 0" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M28.5 10 L6 28 Q4 30 7 30 H53 Q56 30 54 28 Z" fill="none" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}
