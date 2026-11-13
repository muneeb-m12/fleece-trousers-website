// "Try the Look" — shop-the-look outfits built from the real catalogue.
// Adapted from the velvetica.studio "Runway" reel (4 Nov 2026): the reel
// itself would not play past its first frame, so only that frame was
// reproduced — heading, three-piece hero (centre sharp, sides blurred),
// "3 PIECES" strip with + buttons, and a black "Add full look" button.
// Prices are PKR from the catalogue; the look total is always the sum of
// its pieces (a Pack of 2 counts at its Rs 3,499 pack price, not 2× singles).

import { PRODUCTS, formatPKR, type Product } from "@/lib/products";

export type Look = {
  id: string;
  name: string;
  blurb: string;
  /** product ids in strip order; pieces[1] is the hero's centre trouser */
  pieces: [string, string, string];
};

export const LOOKS: Look[] = [
  {
    id: "city-edit",
    name: "The City Edit",
    blurb: "Black, charcoal and navy — the three neutrals that go with everything.",
    pieces: ["charcoal", "black", "navy"],
  },
  {
    id: "night-in",
    name: "Night In",
    blurb: "Soft greys around a charcoal centre. Made for slow evenings.",
    pieces: ["grey", "charcoal", "black"],
  },
  {
    id: "essentials",
    name: "The Essentials",
    blurb: "The best-value pack plus navy and grey — four trousers, three pieces.",
    pieces: ["navy", "pack-black-charcoal", "grey"],
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
