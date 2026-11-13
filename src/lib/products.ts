// Product catalogue — men's fleece trousers (assumed men's; see README).
// Prices are the proposed launch prices from the Nov 2026 research:
// single Rs 2,199 / Pack of 2 Rs 3,499 at the dealer's ~Rs 1,000/piece cost.
// Only Black + Charcoal are confirmed launch colours; the other colours
// are placeholders to swap once the supplier confirms them.

export type Product = {
  id: string;
  name: string;
  colour: string;
  price: number;
  compareAt?: number;
  badge?: string;
  // SVG fill colours: main body, darker trim, stitching
  main: string;
  dark: string;
  stitch: string;
  kind: "single" | "pack";
};

export const SIZES = ["M", "L", "XL", "2XL"] as const;
export type Size = (typeof SIZES)[number];

export const PRODUCTS: Product[] = [
  { id: "black", name: "Classic Fleece Trouser", colour: "Jet Black", price: 2199, main: "#1c1c1e", dark: "#101012", stitch: "#3a3a3e", kind: "single" },
  { id: "charcoal", name: "Classic Fleece Trouser", colour: "Charcoal", price: 2199, main: "#3d3d42", dark: "#2b2b2f", stitch: "#56565c", kind: "single" },
  { id: "navy", name: "Classic Fleece Trouser", colour: "Navy", price: 2199, main: "#1f2a44", dark: "#141d31", stitch: "#33415e", kind: "single" },
  { id: "grey", name: "Classic Fleece Trouser", colour: "Heather Grey", price: 2199, main: "#8a8d90", dark: "#6e7174", stitch: "#a9adb0", kind: "single" },
  { id: "olive", name: "Classic Fleece Trouser", colour: "Olive", price: 2199, main: "#4a4d33", dark: "#353824", stitch: "#62664a", kind: "single" },
  { id: "brown", name: "Classic Fleece Trouser", colour: "Chocolate Brown", price: 2199, main: "#4b3226", dark: "#36241b", stitch: "#65473a", kind: "single" },
  { id: "pack-black-charcoal", name: "Pack of 2 — Fleece Trousers", colour: "Black + Charcoal", price: 3499, compareAt: 4398, badge: "Best value", main: "#1c1c1e", dark: "#101012", stitch: "#3a3a3e", kind: "pack" },
  { id: "pack-black-navy", name: "Pack of 2 — Fleece Trousers", colour: "Black + Navy", price: 3499, compareAt: 4398, badge: "Best value", main: "#1f2a44", dark: "#141d31", stitch: "#33415e", kind: "pack" },
];

export const formatPKR = (n: number) => `Rs ${n.toLocaleString("en-PK")}`;
