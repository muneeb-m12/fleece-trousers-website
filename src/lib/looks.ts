// "Try the Look" — shop-the-look outfits built from the real catalogue.
// Adapted from the velvetica.studio "Runway" reel (4 Nov 2026). The reel
// would not play in the browser, but Muneeb sent a screen recording
// (13 Nov, 7.8s) and its frames were read directly:
//   - Sub-line: "Six looks, styled head to toe. Tap a pin to see the piece."
//   - Look 1 "The City Edit" (charcoal sweatshirt + baggy blue jeans),
//     look 2 "Gallery Opening" (olive sweatshirt + brown trousers),
//     look 3 "Studio Day" (black T-shirt + baggy blue jeans) — then it
//     loops back. Looks change ~1.2s apart (fast demo pace).
//   - Only 3 of the 6 look names are ever visible; the other 3 names
//     here ("Night In", "The Essentials", "Off Duty") are ours, and the
//     reel's real model photos are replaced by AI-generated three-model
//     photos in public/looks/ (same composition: centre sharp, sides
//     blurred, pale lavender background) — they are approximations, not
//     the reel's photos.
// Prices are PKR from the catalogue; the look total is always the sum of
// its pieces (a Pack of 2 counts at its Rs 3,499 pack price, not 2× singles).

import { PRODUCTS, formatPKR, type Product } from "@/lib/products";

export type Look = {
  id: string;
  name: string;
  blurb: string;
  /** hero photo: AI-generated three-model shot in public/looks/ */
  image: string;
  /** product ids in strip order; pieces[1] is the hero's centre trouser */
  pieces: [string, string, string];
};

export const LOOKS: Look[] = [
  {
    id: "city-edit",
    name: "The City Edit",
    blurb: "Black, charcoal and navy — the three neutrals that go with everything.",
    image: "/looks/city-edit.jpg",
    pieces: ["charcoal", "black", "navy"],
  },
  {
    id: "gallery-opening",
    name: "Gallery Opening",
    blurb: "Olive and chocolate brown around a brown centre — smart, still fleece-soft.",
    image: "/looks/gallery-opening.jpg",
    pieces: ["olive", "brown", "charcoal"],
  },
  {
    id: "studio-day",
    name: "Studio Day",
    blurb: "Black and navy with grey — the studio uniform, head to toe.",
    image: "/looks/studio-day.jpg",
    pieces: ["black", "navy", "grey"],
  },
  {
    id: "night-in",
    name: "Night In",
    blurb: "Soft greys around a charcoal centre. Made for slow evenings.",
    image: "/looks/night-in.jpg",
    pieces: ["grey", "charcoal", "black"],
  },
  {
    id: "essentials",
    name: "The Essentials",
    blurb: "The best-value pack plus navy and grey — four trousers, three pieces.",
    image: "/looks/essentials.jpg",
    pieces: ["navy", "pack-black-charcoal", "grey"],
  },
  {
    id: "off-duty",
    name: "Off Duty",
    blurb: "Olive at the centre, charcoal and brown around it — for days off.",
    image: "/looks/off-duty.jpg",
    pieces: ["charcoal", "olive", "brown"],
  },
];

/** Resolve a look's piece ids to products (skips any missing id). */
export function lookProducts(look: Look): Product[] {
  return look.pieces
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is Product => p !== undefined);
}

/** Honest total: sum of the pieces' catalogue prices. */
export function lookTotal(look: Look): number {
  return lookProducts(look).reduce((n, p) => n + p.price, 0);
}

export function lookTotalLabel(look: Look): string {
  return formatPKR(lookTotal(look));
}
