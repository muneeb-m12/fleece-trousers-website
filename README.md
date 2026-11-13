# FLEECE. — Fleece Trousers Products Page (Next.js)

A minimal products page for men's fleece trousers in Pakistan, modelled on the
[Instagram reel by @w.wearebrand](https://www.instagram.com/reel/DfP38XtxOUW/)
(2 Nov 2026): plain white store, centred wordmark header, one horizontal
hanging rail of garments instead of a product grid, and a centred product-detail
view with front/back toggle, size pills and a wide add-to-cart button.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (verified 13 Nov 2026)
npm run start
```

`dev` and `build` run with `--webpack` on purpose: Next.js 16 defaults to
Turbopack, whose native SWC binary fails to load on some Windows machines
("not a valid Win32 application" / "Turbopack is not supported on this
platform"). Webpack works everywhere. If `npm run dev` still fails on your
machine, delete `node_modules` and run `npm install` again to re-download
the Windows SWC binary, then try again.

Next.js 16 + React 19 + Tailwind CSS 4, App Router. No database, no checkout
yet — this is the products page only, as requested.

## What's on the page

- **Rail:** 8 products hanging from one metal rail — 6 singles at Rs 2,199
  (Jet Black, Charcoal, Navy, Heather Grey, Olive, Chocolate Brown) and 2
  Pack of 2 at Rs 3,499 (Black + Charcoal, Black + Navy). Hover shows the
  colour and price; click opens the detail view.
- **Detail view:** selected trouser centred and sharp, neighbours blurred at
  the sides, prev/next arrows, PKR price, FRONT / BACK toggle, size pills
  (M / L / XL / 2XL), wide grey Add to Cart button. Add to cart requires a
  size; the bag (top-right) opens a drawer with the total.
- **Below the rail:** trust strip (280–320 GSM brushed fleece, COD, delivery
  across Pakistan, 7-day exchange), product spec and a size guide.

## Placeholders to replace before launch

- **Brand name:** the wordmark is "FLEECE." — rename it in
  `src/components/Store.tsx` when the brand has a name.
- **Colours:** only Black + Charcoal are confirmed launch colours from the
  Nov 2026 research. Navy, Grey, Olive and Brown on the rail are placeholders
  — swap them out once the supplier confirms what he can stitch.
- **Product images:** the trousers are clean SVG drawings, because no samples
  or product photos exist yet. Replace `TrouserArt` with real photos once
  samples arrive (weigh + wash-test them first, per the research PDF).
- **Prices:** Rs 2,199 single / Rs 3,499 Pack of 2 are the proposed launch
  prices at the dealer's ~Rs 1,000/piece cost — not yet confirmed by Muneeb.
- **Checkout:** the bag drawer states plainly that checkout is the next step.
  Orders will be Cash on Delivery, confirmed on WhatsApp before dispatch.
  Plug in the WhatsApp number when checkout is built.
- **Men's vs women's:** the whole page assumes men's fleece trousers, as in
  all earlier drafts. If it's women's, the sizing and size guide change.

## Files

- `src/lib/products.ts` — catalogue (products, sizes, PKR formatting)
- `src/components/TrouserArt.tsx` — SVG trouser + hanger
- `src/components/Store.tsx` — rail, detail view, cart drawer
- `src/app/page.tsx` — renders the store
