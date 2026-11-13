// "Try the Look" — the shop-the-look section from the velvetica.studio
// "Runway" reel, adapted to the fleece catalogue. Mobile-first, on the
// reel's very pale lavender background:
//   bold "Try the Look." heading, three-trouser hero (centre sharp,
//   sides blurred), thin divider, look label + "3 PIECES" strip with +
//   buttons, black full-width "Add full look" button, grey pill below.
// The trousers are the same SVG art as the rail (no photos exist yet);
// prices are PKR from the catalogue and the look total is the sum of
// its pieces — see src/lib/looks.ts.

"use client";

import { useState } from "react";
import TrouserArt from "@/components/TrouserArt";
import LookBackground from "@/components/LookBackground";
import { LOOKS, lookProducts, lookTotalLabel, type Look } from "@/lib/looks";
import { formatPKR, type Product } from "@/lib/products";

export default function TryTheLook({
  onAddPiece,
  onAddLook,
}: {
  onAddPiece: (p: Product) => void;
  onAddLook: (products: Product[]) => void;
}) {
  const [look, setLook] = useState<Look>(LOOKS[0]);
  const pieces = lookProducts(look);
  // pieces[1] is the hero's centre trouser; [0] and [2] flank it, blurred.
  const [left, centre, right] = pieces;

  const browseRail = () => {
    document.getElementById("rail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section aria-label="Try the look" className="relative mt-16 overflow-hidden rounded-3xl bg-[#f4f1fb]">
      <LookBackground />
      <div className="relative px-5 py-8 sm:px-10 sm:py-12">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">Try the Look.</h2>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500">
          Three trousers, one ready-made outfit. Tap a look, add a piece — or take the whole look.
        </p>

        {/* look switcher */}
        <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Choose a look">
          {LOOKS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLook(l)}
              aria-pressed={look.id === l.id}
              className={`rounded-full px-4 py-2 text-xs font-bold uppercase tracking-widest transition ${
                look.id === l.id ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-300"
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* hero: centre sharp, sides blurred — crossfades/slides on switch */}
        {centre && (
          <div key={look.id} className="look-swap mt-6 flex items-end justify-center gap-1 sm:gap-4">
            {left && (
              <div className="w-24 shrink-0 scale-[0.85] opacity-60 blur-[3px] sm:w-32" aria-hidden="true">
                <TrouserArt product={left} className="h-auto w-full" />
              </div>
            )}
            <div className="w-40 shrink-0 sm:w-56">
              <TrouserArt product={centre} className="h-auto w-full drop-shadow-md" />
            </div>
            {right && (
              <div className="w-24 shrink-0 scale-[0.85] opacity-60 blur-[3px] sm:w-32" aria-hidden="true">
                <TrouserArt product={right} className="h-auto w-full" />
              </div>
            )}
          </div>
        )}

        {/* thin divider, like the reel */}
        <hr className="mt-6 border-neutral-300/70" />

        {/* look label + piece count */}
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-base font-bold text-neutral-900">{look.name}</p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{pieces.length} pieces</p>
        </div>
        <p className="mt-1 text-sm text-neutral-600">{look.blurb}</p>

        {/* product strip: thumbnails with + buttons */}
        <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
          {pieces.map((p) => (
            <div key={p.id} className="relative rounded-2xl bg-white p-2 text-center shadow-sm sm:p-3">
              <button
                onClick={() => onAddPiece(p)}
                aria-label={`Add ${p.name}, ${p.colour}, ${formatPKR(p.price)} to bag`}
                className="absolute -right-1.5 -top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-neutral-900 text-base font-bold leading-none text-white shadow transition hover:scale-110"
              >
                +
              </button>
              <TrouserArt product={p} className="mx-auto h-20 w-auto sm:h-24" />
              {p.kind === "pack" && (
                <span className="mt-1 inline-block rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Pack of 2
                </span>
              )}
              <p className="mt-1 truncate text-xs font-semibold text-neutral-900">{p.colour}</p>
              <p className="text-xs text-neutral-600">{formatPKR(p.price)}</p>
            </div>
          ))}
        </div>

        {/* black full-width CTA — total is the sum of the pieces */}
        <button
          onClick={() => onAddLook(pieces)}
          className="mt-6 w-full rounded-full bg-neutral-900 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
        >
          Add full look — {lookTotalLabel(look)}
        </button>
        <div className="mt-3 text-center">
          <button
            onClick={browseRail}
            className="rounded-full bg-neutral-200/80 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-700 transition hover:bg-neutral-300"
          >
            Browse all trousers
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">Cash on Delivery · 7-day exchange · Pieces added in size L</p>
      </div>
    </section>
  );
}
