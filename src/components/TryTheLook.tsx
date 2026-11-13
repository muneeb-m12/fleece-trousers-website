// "Try the Look" — the shop-the-look section from the velvetica.studio
// "Runway" reel, adapted to the fleece catalogue. Mobile-first and
// phone-width (max-w ~520px, centred) on the reel's very pale lavender
// background, like the phone screen in the reel:
//   bold "Try the Look." heading, hero PHOTO of three models per look
//   (AI-generated approximations in public/looks/ — same composition as
//   the reel: centre model sharp, side models blurred — not the reel's
//   photos), thin divider, look label + "3 PIECES" compact strip with +
//   buttons, black full-width "Add full look" button, grey store pill.
// Motion (verified from Muneeb's screen recording of the reel, 13 Nov):
//   the hero photo slides HORIZONTALLY — incoming from the right,
//   outgoing out to the left; the reel cycles looks ~1.2s apart (fast demo
//   pace); here it auto-advances every 3s, the usable store pace. Swiping
//   the hero left/right changes looks. Small dot indicators under the hero
//   switch looks on tap (the reel has no look pills). No particle or
//   WebGL background — the reel's background is clean pale lavender.
// Prices are PKR from the catalogue and the look total is the sum of its
// pieces — see src/lib/looks.ts.

"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import TrouserArt from "@/components/TrouserArt";
import { LOOKS, lookProducts, lookTotalLabel, type Look } from "@/lib/looks";
import { formatPKR, type Product } from "@/lib/products";

/** Hero photo for one look: 1120×2240 portrait, three models, centre sharp. */
function HeroPhoto({ look, priority }: { look: Look; priority?: boolean }) {
  return (
    <Image
      src={look.image}
      width={1120}
      height={2240}
      alt={`${look.name} — three models wearing fleece jogger trousers`}
      className="h-auto w-full"
      priority={priority}
    />
  );
}

export default function TryTheLook({
  onAddPiece,
  onAddLook,
}: {
  onAddPiece: (p: Product) => void;
  onAddLook: (products: Product[]) => void;
}) {
  const [index, setIndex] = useState(0);
  // The outgoing look, kept rendered (absolutely overlaid) only while it slides out.
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  // Under prefers-reduced-motion there is no auto-advance and no slide
  // (instant change). Read via useSyncExternalStore so the server
  // prerender (false) and the client agree without a setState-in-effect.
  const reducedMotion = useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
  const look = LOOKS[index];
  const pieces = lookProducts(look);

  // Auto-advance bookkeeping: the next advance happens at nextAtRef, and
  // only while the user is not hovering/touching the section (pausedRef).
  // The reel cycles ~1.2s apart (demo pace); 3s is the usable store pace.
  // nextAtRef starts at 0 and is armed on mount — Date.now() must not run
  // during render, or the server prerender fails on the unstable value.
  const nextAtRef = useRef(0);
  const pausedRef = useRef(false);
  const exitTimerRef = useRef<number | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    nextAtRef.current = Date.now() + 3000;
  }, []);

  useEffect(
    () => () => {
      if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
    },
    []
  );

  const goTo = useCallback(
    (next: number, dir: 1 | -1, resumeMs = 6000) => {
      const target = ((next % LOOKS.length) + LOOKS.length) % LOOKS.length;
      if (target === index) return;
      if (!reducedMotion) {
        setPrevIndex(index);
        setDirection(dir);
        if (exitTimerRef.current) window.clearTimeout(exitTimerRef.current);
        // Clear the outgoing photo once its ~550ms slide has finished.
        exitTimerRef.current = window.setTimeout(() => setPrevIndex(null), 600);
      }
      setIndex(target);
      // Resume auto-advance ~6s after any change (manual or automatic).
      nextAtRef.current = Date.now() + resumeMs;
    },
    [index, reducedMotion]
  );

  // Auto-advance every 3s, paused while the user hovers/touches the
  // section; under prefers-reduced-motion there is no auto-advance at all.
  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (nextAtRef.current === 0) return;
      if (Date.now() >= nextAtRef.current) goTo(index + 1, 1, 3000);
    }, 500);
    return () => window.clearInterval(id);
  }, [index, reducedMotion, goTo]);

  const pauseAuto = () => {
    pausedRef.current = true;
  };
  const resumeAuto = () => {
    pausedRef.current = false;
    nextAtRef.current = Date.now() + 6000;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    pauseAuto();
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    resumeAuto();
    if (!start) return;
    const dx = e.changedTouches[0].clientX - start.x;
    const dy = e.changedTouches[0].clientY - start.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) goTo(index + 1, 1);
      else goTo(index - 1, -1);
    }
  };

  const browseRail = () => {
    document.getElementById("rail")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const sliding = prevIndex !== null && !reducedMotion;

  return (
    <section
      aria-label="Try the look"
      className="mx-auto mt-16 w-full max-w-[520px] overflow-hidden rounded-3xl bg-[#f4f1fb]"
      onPointerEnter={pauseAuto}
      onPointerLeave={resumeAuto}
    >
      <div className="px-5 py-8 sm:px-8">
        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">Try the Look.</h2>
        <p className="mt-2 text-sm leading-relaxed text-neutral-500">
          Six looks, styled head to toe. Tap + to add a piece.
        </p>

        {/* hero photo: three models, centre sharp — slides horizontally on
            switch, like the reel: incoming from the right, outgoing out to
            the left. */}
        <div
          className="relative mt-6 touch-pan-y overflow-hidden rounded-2xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          role="region"
          aria-label={`${look.name} — swipe to change look`}
        >
          {sliding && prevIndex !== null && (
            <div
              key={`exit-${prevIndex}`}
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 ${
                direction === 1 ? "look-exit-left" : "look-exit-right"
              }`}
            >
              <HeroPhoto look={LOOKS[prevIndex]} />
            </div>
          )}
          <div
            key={`enter-${index}`}
            className={sliding ? (direction === 1 ? "look-enter-right" : "look-enter-left") : ""}
          >
            <HeroPhoto look={look} priority={index === 0} />
          </div>
        </div>

        {/* dot indicators — the reel has no look pills, it just cycles */}
        <div className="mt-4 flex justify-center gap-2" role="group" aria-label="Choose a look">
          {LOOKS.map((l, i) => (
            <button
              key={l.id}
              onClick={() => goTo(i, i > index ? 1 : -1)}
              aria-label={`Show look ${l.name}`}
              aria-pressed={index === i}
              className={`h-2 rounded-full transition-all ${
                index === i ? "w-6 bg-neutral-900" : "w-2 bg-neutral-300 hover:bg-neutral-400"
              }`}
            />
          ))}
        </div>

        {/* thin divider, like the reel */}
        <hr className="mt-5 border-neutral-300/70" />

        {/* look label + piece count */}
        <div className="mt-4 flex items-baseline justify-between gap-3">
          <p className="text-base font-bold text-neutral-900">{look.name}</p>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">{pieces.length} pieces</p>
        </div>
        <p className="mt-1 text-sm text-neutral-600">{look.blurb}</p>

        {/* compact pieces strip: small thumbnails in a single row with +
            buttons, like the reel — not big cards */}
        <div className="mt-4 flex gap-2">
          {pieces.map((p) => (
            <div key={p.id} className="relative flex-1 rounded-xl bg-white px-1 pb-2 pt-1 text-center shadow-sm">
              <button
                onClick={() => onAddPiece(p)}
                aria-label={`Add ${p.name}, ${p.colour}, ${formatPKR(p.price)} to bag`}
                className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-sm font-bold leading-none text-white shadow transition hover:scale-110"
              >
                +
              </button>
              <TrouserArt product={p} className="mx-auto h-14 w-auto" />
              <p className="mt-0.5 truncate text-[11px] font-semibold text-neutral-900">{p.colour}</p>
              <p className="text-[11px] text-neutral-600">{formatPKR(p.price)}</p>
            </div>
          ))}
        </div>

        {/* black full-width CTA directly under the strip — total is the sum
            of the pieces */}
        <button
          onClick={() => onAddLook(pieces)}
          className="mt-4 w-full rounded-full bg-neutral-900 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition hover:bg-neutral-800"
        >
          Add full look — {lookTotalLabel(look)}
        </button>
        {/* store pill, like the reel's store-URL pill — no domain exists yet,
            so it shows the store name and scrolls back to the rail. */}
        <div className="mt-3 text-center">
          <button
            onClick={browseRail}
            className="rounded-full bg-neutral-200/80 px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-neutral-700 transition hover:bg-neutral-300"
          >
            FLEECE. · Pakistan
          </button>
        </div>
        <p className="mt-3 text-center text-xs text-neutral-500">Cash on Delivery · 7-day exchange · Pieces added in size L</p>
      </div>
    </section>
  );
}
