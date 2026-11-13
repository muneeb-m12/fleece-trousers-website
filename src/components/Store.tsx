"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import TrouserArt, { Hanger } from "@/components/TrouserArt";
import { PRODUCTS, SIZES, formatPKR, type Product, type Size } from "@/lib/products";

type CartLine = { product: Product; size: Size; qty: number };
type Rect = { x: number; y: number; w: number; h: number };
type DetailPhase = "zoom-in" | "open" | "zoom-out";
type Detail = { product: Product; from: Rect; phase: DetailPhase };

const ZOOM_MS = 550;

// Where the trouser lands in the detail view: centred, py-10 (40px) from top.
function zoomTarget(): Rect {
  const h = Math.min(416, window.innerHeight * 0.62);
  const w = (h * 200) / 270;
  return { x: (window.innerWidth - w) / 2, y: 40, w, h };
}

export default function Store() {
  const [detail, setDetail] = useState<Detail | null>(null);
  const [zoomArrived, setZoomArrived] = useState(false);
  const [view, setView] = useState<"front" | "back">("front");
  const [size, setSize] = useState<Size | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((n, l) => n + l.qty * l.product.price, 0), [cart]);
  const selected = detail?.product ?? null;

  const closeDetail = useCallback(() => {
    setZoomArrived(false);
    setDetail((d) => {
      if (!d) return d;
      if (d.phase !== "open") return null; // zoom-in interrupted: just vanish
      return { ...d, phase: "zoom-out" };
    });
  }, []);

  // Drive the zoom phases: after the clone reaches the target, open the
  // full detail view; after it flies back to the rail, remove the overlay.
  useEffect(() => {
    if (!detail) return;
    if (detail.phase === "zoom-in") {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setZoomArrived(true)));
      timer.current = setTimeout(() => setDetail((d) => (d ? { ...d, phase: "open" } : d)), ZOOM_MS + 60);
      return () => {
        cancelAnimationFrame(raf);
        if (timer.current) clearTimeout(timer.current);
      };
    }
    if (detail.phase === "zoom-out") {
      const raf = requestAnimationFrame(() => requestAnimationFrame(() => setZoomArrived(true)));
      timer.current = setTimeout(() => setDetail(null), ZOOM_MS);
      return () => {
        cancelAnimationFrame(raf);
        if (timer.current) clearTimeout(timer.current);
      };
    }
  }, [detail]);

  // Lock page scroll + Escape to close while the detail view is open.
  useEffect(() => {
    if (!detail) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [detail, closeDetail]);

  const openProduct = (p: Product, e: React.MouseEvent<HTMLButtonElement>) => {
    const art = e.currentTarget.querySelector<HTMLElement>("[data-trouser]");
    const r = art?.getBoundingClientRect();
    const from: Rect = r
      ? { x: r.left, y: r.top, w: r.width, h: r.height }
      : { x: window.innerWidth / 2 - 40, y: window.innerHeight / 2 - 60, w: 80, h: 108 };
    setView("front");
    setSize(null);
    setSizeError(false);
    setZoomArrived(false);
    setDetail({ product: p, from, phase: "zoom-in" });
  };

  const step = (dir: 1 | -1) => {
    if (!detail) return;
    const i = PRODUCTS.findIndex((p) => p.id === detail.product.id);
    const next = PRODUCTS[(i + dir + PRODUCTS.length) % PRODUCTS.length];
    setDetail({ ...detail, product: next });
    setView("front");
    setSize(null);
    setSizeError(false);
  };

  const neighbours = (p: Product) => {
    const i = PRODUCTS.findIndex((x) => x.id === p.id);
    return {
      prev: PRODUCTS[(i - 1 + PRODUCTS.length) % PRODUCTS.length],
      next: PRODUCTS[(i + 1) % PRODUCTS.length],
    };
  };

  const addToCart = () => {
    if (!selected) return;
    if (!size) {
      setSizeError(true);
      return;
    }
    setCart((c) => {
      const i = c.findIndex((l) => l.product.id === selected.id && l.size === size);
      if (i >= 0) {
        const copy = [...c];
        copy[i] = { ...copy[i], qty: copy[i].qty + 1 };
        return copy;
      }
      return [...c, { product: selected, size, qty: 1 }];
    });
    setToast(`Added — ${selected.name}, ${selected.colour}, size ${size}`);
    setTimeout(() => setToast(""), 2600);
  };

  // The flying clone: starts on the rail item, flies to the detail spot
  // (zoom-in), and flies back to the rail on close (zoom-out).
  const cloneRect = (d: Detail): Rect => {
    const target = zoomTarget();
    if (d.phase === "zoom-in") return zoomArrived ? target : d.from;
    if (d.phase === "zoom-out") return zoomArrived ? d.from : target;
    return target;
  };

  return (
    <div className="min-h-screen bg-[#fafaf7] text-neutral-900">
      {/* ---- Header: centred wordmark, icons top-right (like the reel) ---- */}
      <header className="relative border-b border-neutral-200/70 px-6 py-5">
        <p className="text-center text-2xl font-extrabold tracking-[0.35em]">FLEECE.</p>
        <p className="mt-1 text-center text-[11px] uppercase tracking-[0.25em] text-neutral-500">
          Premium fleece trousers · Pakistan
        </p>
        <div className="absolute right-6 top-5 flex items-center gap-4">
          <button aria-label="Search" className="text-xl leading-none" onClick={() => setToast("Search is coming with the full store — browse the rail for now.")}>
            ⌕
          </button>
          <button aria-label="Shopping bag" className="relative text-xl leading-none" onClick={() => setCartOpen(true)}>
            🛍
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-20">
        <p className="mt-10 text-center text-sm text-neutral-600">
          Winter 2026 · 280–320 GSM brushed fleece · Cash on Delivery across Pakistan
        </p>

        {/* ---- The rail: one horizontal rail, garments hanging in a row ---- */}
        <section aria-label="Products" className="mt-6">
          <div className="relative mx-auto max-w-5xl">
            {/* metal rail */}
            <div className="h-2 rounded-full bg-gradient-to-r from-neutral-300 via-neutral-400 to-neutral-300 shadow-sm" />
            <div className="flex items-start justify-between gap-1 px-2 sm:gap-3">
              {PRODUCTS.map((p) => (
                <button
                  key={p.id}
                  onClick={(e) => openProduct(p, e)}
                  className="group relative flex w-[11%] flex-col items-center pt-1 outline-none"
                  aria-label={`${p.name}, ${p.colour}, ${formatPKR(p.price)}`}
                >
                  <Hanger />
                  <span
                    data-trouser
                    className={`block transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-1deg] group-focus-visible:-translate-y-2 ${
                      detail && detail.product.id === p.id && detail.phase !== "open" ? "opacity-0" : ""
                    }`}
                  >
                    <TrouserArt product={p} className="h-40 w-auto drop-shadow-sm sm:h-52" />
                  </span>
                  {p.badge && (
                    <span className="mt-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      {p.badge}
                    </span>
                  )}
                  <span className="mt-2 text-center text-[11px] font-semibold leading-tight opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-xs">
                    {p.colour}
                    <span className="block font-normal text-neutral-600">{formatPKR(p.price)}</span>
                  </span>
                </button>
              ))}
            </div>
            <p className="mt-4 text-center text-xs text-neutral-500">
              Tap a trouser to see it up close — hover the rail to see colours &amp; prices.
            </p>
          </div>
        </section>

        {/* ---- Trust strip ---- */}
        <section className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 text-center text-xs text-neutral-600 sm:grid-cols-4">
          {["280–320 GSM brushed fleece", "Cash on Delivery", "Delivery across Pakistan", "7-day easy exchange"].map((t) => (
            <div key={t} className="rounded-full border border-neutral-200 bg-white px-3 py-2">{t}</div>
          ))}
        </section>

        {/* ---- The details + size guide ---- */}
        <section className="mx-auto mt-14 grid max-w-4xl gap-8 sm:grid-cols-2">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">The trouser</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700">
              <li>· 280–320 GSM cotton fleece, brushed inside</li>
              <li>· Ribbed ankle cuff, elastic waist + drawstring</li>
              <li>· One zip pocket, double-stitched stress points</li>
              <li>· Black &amp; Charcoal first — more colours as samples are confirmed</li>
            </ul>
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em]">Size guide</h2>
            <table className="mt-3 w-full text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-neutral-500">
                  <th className="py-1">Size</th><th>Waist</th><th>Length</th>
                </tr>
              </thead>
              <tbody className="text-neutral-700">
                <tr className="border-b border-neutral-100"><td className="py-1.5 font-semibold">M</td><td>30–32&quot;</td><td>39&quot;</td></tr>
                <tr className="border-b border-neutral-100"><td className="py-1.5 font-semibold">L</td><td>32–34&quot;</td><td>40&quot;</td></tr>
                <tr className="border-b border-neutral-100"><td className="py-1.5 font-semibold">XL</td><td>34–36&quot;</td><td>41&quot;</td></tr>
                <tr><td className="py-1.5 font-semibold">2XL</td><td>36–38&quot;</td><td>42&quot;</td></tr>
              </tbody>
            </table>
            <p className="mt-2 text-xs text-neutral-500">Measurements are a guide — confirm against the first sample before launch.</p>
          </div>
        </section>
      </main>

      <footer className="border-t border-neutral-200/70 py-6 text-center text-xs text-neutral-500">
        FLEECE. · Premium fleece trousers · Made for Pakistani winters · COD available
      </footer>

      {/* ---- Product detail view: the trouser ZOOMS from the rail into the centre (like the reel) ---- */}
      {detail && selected && (
        <div
          className="fixed inset-0 z-40 overflow-y-auto transition-[opacity,background-color] duration-300"
          style={{
            opacity: detail.phase === "zoom-out" ? 0 : 1,
            // Transparent while the trouser flies, so the rail stays visible
            // behind it — exactly like the reel. Opaque once it lands.
            backgroundColor: detail.phase === "open" ? "rgba(250, 250, 247, 0.98)" : "rgba(250, 250, 247, 0)",
          }}
          role="dialog"
          aria-modal="true"
          aria-label={selected.name}
        >
          {/* flying clone — the zoom itself */}
          {detail.phase !== "open" && (
            <div
              className="pointer-events-none fixed z-20"
              style={{
                left: cloneRect(detail).x,
                top: cloneRect(detail).y,
                width: cloneRect(detail).w,
                height: cloneRect(detail).h,
                transition: `left ${ZOOM_MS}ms cubic-bezier(0.22, 1, 0.36, 1), top ${ZOOM_MS}ms cubic-bezier(0.22, 1, 0.36, 1), width ${ZOOM_MS}ms cubic-bezier(0.22, 1, 0.36, 1), height ${ZOOM_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
              }}
            >
              <TrouserArt product={detail.product} view={view} className="h-full w-full drop-shadow-md" />
            </div>
          )}

          {/* full detail content — fades in once the zoom lands */}
          {detail.phase === "open" && (
            <div className="detail-fade-up relative mx-auto flex min-h-full max-w-5xl flex-col items-center px-4 py-10">
              <button onClick={closeDetail} aria-label="Close" className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-lg">✕</button>
              {/* neighbours, blurred at the sides */}
              <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-40 items-center justify-center opacity-40 blur-[3px] md:flex">
                <TrouserArt product={neighbours(selected).prev} className="h-72 w-auto" />
              </div>
              <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 items-center justify-center opacity-40 blur-[3px] md:flex">
                <TrouserArt product={neighbours(selected).next} className="h-72 w-auto" />
              </div>
              {/* prev / next arrows */}
              <button onClick={() => step(-1)} aria-label="Previous product" className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-xl shadow-sm">‹</button>
              <button onClick={() => step(1)} aria-label="Next product" className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-300 bg-white text-xl shadow-sm">›</button>

              <div key={selected.id} className="detail-swap">
                <TrouserArt product={selected} view={view} className="h-80 w-auto drop-shadow-md sm:h-[26rem]" />
              </div>
              <h1 className="mt-6 text-center text-xl font-bold">{selected.name}</h1>
              <p className="mt-1 text-sm text-neutral-600">{selected.colour} · 280–320 GSM brushed fleece</p>
              <p className="mt-2 text-lg font-bold">
                {formatPKR(selected.price)}
                {selected.compareAt && <span className="ml-2 text-sm font-normal text-neutral-500 line-through">{formatPKR(selected.compareAt)}</span>}
                {selected.compareAt && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">Save {formatPKR(selected.compareAt - selected.price)}</span>}
              </p>

              {/* FRONT / BACK toggle */}
              <div className="mt-5 flex gap-2" role="group" aria-label="View">
                {(["front", "back"] as const).map((v) => (
                  <button
                    key={v}
                    onClick={() => setView(v)}
                    className={`rounded-full px-5 py-2 text-xs font-bold uppercase tracking-widest ${view === v ? "bg-neutral-900 text-white" : "bg-white text-neutral-700 ring-1 ring-neutral-300"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* size pills */}
              <div className="mt-5 flex gap-2" role="group" aria-label="Size">
                {SIZES.map((s) => (
                  <button
                    key={s}
                    onClick={() => { setSize(s); setSizeError(false); }}
                    className={`h-11 w-14 rounded-full text-sm font-semibold ${size === s ? "bg-neutral-900 text-white" : "bg-white ring-1 ring-neutral-300"} ${sizeError ? "ring-2 ring-red-500" : ""}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {sizeError && <p className="mt-2 text-sm font-medium text-red-600">Please choose a size first.</p>}

              {/* wide grey add-to-cart button */}
              <button
                onClick={addToCart}
                className="mt-6 w-full max-w-md rounded-full bg-neutral-200 py-4 text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 transition hover:bg-neutral-300"
              >
                Add to cart — {formatPKR(selected.price)}
              </button>
              <p className="mt-3 text-xs text-neutral-500">Cash on Delivery · Order confirmed on WhatsApp before dispatch · 7-day exchange</p>
            </div>
          )}
        </div>
      )}

      {/* ---- Cart drawer ---- */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={() => setCartOpen(false)}>
          <aside className="h-full w-full max-w-sm overflow-y-auto bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Your bag ({cartCount})</h2>
              <button onClick={() => setCartOpen(false)} aria-label="Close bag" className="text-xl">✕</button>
            </div>
            {cart.length === 0 ? (
              <p className="mt-6 text-sm text-neutral-600">Your bag is empty. Tap a trouser on the rail to add one.</p>
            ) : (
              <>
                <ul className="mt-4 space-y-4">
                  {cart.map((l, i) => (
                    <li key={i} className="flex items-center gap-3 border-b border-neutral-100 pb-4">
                      <TrouserArt product={l.product} className="h-20 w-auto" />
                      <div className="flex-1 text-sm">
                        <p className="font-semibold">{l.product.name}</p>
                        <p className="text-neutral-600">{l.product.colour} · Size {l.size} · × {l.qty}</p>
                      </div>
                      <p className="text-sm font-bold">{formatPKR(l.product.price * l.qty)}</p>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex justify-between text-base font-bold">
                  <span>Total</span><span>{formatPKR(cartTotal)}</span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-neutral-500">
                  Checkout is the next step — for now this is the products page only. Orders will be Cash on Delivery, confirmed on WhatsApp before dispatch.
                </p>
                <button onClick={() => setCart([])} className="mt-4 text-sm text-neutral-500 underline">Clear bag</button>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ---- Toast ---- */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-neutral-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
