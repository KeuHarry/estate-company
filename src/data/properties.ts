import type { PhotoKey } from "./photos";

/*
 * Fictional listings. Prices are monthly rent in euros so the filters compare like with like.
 * `model` drives the procedural 3D house on the property page (see components/three/villa.tsx).
 */

export type PropertyType = "villa" | "house" | "apartment" | "loft" | "townhouse";
export type City = "Lisbon" | "Barcelona" | "Cape Town" | "Dubai" | "Paris";

export interface Volume {
  /** width (x) and depth (z) in metres / 4 — the model is built at roughly 1:4 */
  w: number;
  d: number;
  x?: number;
  z?: number;
  /** share of the width that is solid wall instead of glass; negative puts it on the left */
  core?: number;
  /** what this level holds, shown in the floor list */
  rooms: string;
}

export interface HouseModel {
  floors: Volume[];
  pool?: { w: number; d: number; x: number; z: number };
  stair?: "left" | "right";
  trees?: [x: number, z: number, scale: number][];
  /** timber cladding on the solid cores */
  timber?: boolean;
  /** apartments: which level is the home for rent */
  unit?: number;
}

export interface Property {
  slug: string;
  name: string;
  city: City;
  area: string;
  type: PropertyType;
  beds: number;
  baths: number;
  size: number;
  rent: number;
  furnished: boolean;
  available: string;
  minTerm: string;
  summary: string;
  description: string[];
  amenities: string[];
  photos: PhotoKey[];
  featured?: boolean;
  model: HouseModel;
}

export const properties: Property[] = [
  {
    slug: "casa-alba",
    name: "Casa Alba",
    city: "Lisbon",
    area: "Cascais",
    type: "villa",
    beds: 4,
    baths: 4,
    size: 310,
    rent: 9800,
    furnished: true,
    available: "1 November 2026",
    minTerm: "12 months",
    summary: "Three white levels stepping up from a heated pool, twenty minutes from Lisbon.",
    description: [
      "Casa Alba sits on a quiet lane above Cascais bay. The ground floor opens fully to the pool terrace, and the living room, kitchen and dining table share one long room of glass.",
      "Upstairs, three suites face the sea. The fourth bedroom is on the top level, next to a roof terrace that catches the last of the evening sun.",
    ],
    amenities: ["Heated pool", "Roof terrace", "Sea views", "Home office", "Parking for two", "Underfloor heating", "Weekly cleaning"],
    photos: ["albaPool", "openPlan", "calmBedroom", "stoneBath"],
    featured: true,
    model: {
      floors: [
        { w: 5.2, d: 3.2, rooms: "Living room, kitchen, dining, guest WC", core: 0.28 },
        { w: 4.6, d: 3, x: 0.5, z: -0.1, rooms: "Three suites with sea-facing balconies", core: -0.22 },
        { w: 2.2, d: 2.2, x: 1.2, z: -0.4, rooms: "Fourth bedroom and roof terrace", core: 0.3 },
      ],
      pool: { w: 4.2, d: 1.5, x: -0.4, z: 3 },
      stair: "left",
      trees: [[-3.6, -1.2, 1], [3.8, 1.2, 0.8], [-3.2, 2.4, 0.7]],
    },
  },
  {
    slug: "eaves-house",
    name: "The Eaves House",
    city: "Cape Town",
    area: "Constantia",
    type: "house",
    beds: 5,
    baths: 4,
    size: 420,
    rent: 6400,
    furnished: true,
    available: "Now",
    minTerm: "6 months",
    summary: "A dark timber family house under an old oak, with a glass living room that glows at night.",
    description: [
      "The Eaves House was built around the oak in its garden. The living room is a glass box set under the tree, so the light changes with the leaves through the day.",
      "Five bedrooms are spread across two floors, with a separate studio over the garage for guests or work.",
    ],
    amenities: ["Large garden", "Wine cellar", "Fireplace", "Studio", "Solar power", "Backup water", "Gated parking"],
    photos: ["eavesDusk", "windowLounge", "luxeBedroom", "greenDining"],
    featured: true,
    model: {
      floors: [
        { w: 4.8, d: 3.4, rooms: "Glass living room, kitchen, studio", core: -0.35 },
        { w: 5.2, d: 3, x: -0.3, z: 0.2, rooms: "Five bedrooms, family bathroom", core: 0.4 },
      ],
      timber: true,
      trees: [[3.4, -1.6, 1.4], [-3.8, 0.8, 1], [3, 2.4, 0.8]],
    },
  },
  {
    slug: "solace-villa",
    name: "Solace Villa",
    city: "Dubai",
    area: "Jumeirah",
    type: "villa",
    beds: 6,
    baths: 7,
    size: 610,
    rent: 18500,
    furnished: true,
    available: "15 December 2026",
    minTerm: "12 months",
    summary: "A wide white villa with a timber soffit, a glass stair and a pool the length of the house.",
    description: [
      "Solace is a villa for entertaining. The ground floor is one room from the front door to the pool, divided only by a floating timber stair behind glass.",
      "Six suites sit upstairs and on the roof, each with a private terrace. Staff quarters and a separate garage are at the side.",
    ],
    amenities: ["25 m pool", "Staff quarters", "Private gym", "Cinema room", "Garage for three", "Beach access", "Concierge"],
    photos: ["solaceFront", "glassStair", "greenDining", "luxeBedroom"],
    featured: true,
    model: {
      floors: [
        { w: 6, d: 3.4, rooms: "Reception, dining, kitchen, cinema", core: 0.2 },
        { w: 6.4, d: 3.2, x: -0.2, rooms: "Four suites with terraces", core: -0.2 },
        { w: 3.2, d: 2.6, x: 0.8, z: -0.3, rooms: "Two suites, gym and roof garden", core: 0.25 },
      ],
      pool: { w: 6, d: 1.6, x: 0, z: 3.2 },
      timber: true,
      trees: [[-4.4, -1, 1.1], [4.4, -0.6, 1.2]],
    },
  },
  {
    slug: "linden-court",
    name: "Linden Court",
    city: "Paris",
    area: "Le Marais",
    type: "apartment",
    beds: 2,
    baths: 1,
    size: 96,
    rent: 4200,
    furnished: true,
    available: "Now",
    minTerm: "12 months",
    summary: "A third-floor apartment with tall shuttered windows over a courtyard of linden trees.",
    description: [
      "Linden Court is on the third floor of a restored 1890s building in the Marais. Every room has tall windows onto the courtyard, so the flat is quiet and full of light.",
      "The kitchen was redone in 2025. A lift and a bicycle room are on the ground floor.",
    ],
    amenities: ["Lift", "Courtyard views", "Bicycle storage", "Washer-dryer", "Fibre internet", "Caretaker"],
    photos: ["classicLounge", "aptKitchen", "orangeBed", "whiteBath"],
    model: {
      floors: [
        { w: 3.6, d: 2.8, rooms: "Entrance and shops", core: 0.5 },
        { w: 3.6, d: 2.8, rooms: "Apartments", core: 0.3 },
        { w: 3.6, d: 2.8, rooms: "Apartments", core: 0.3 },
        { w: 3.6, d: 2.8, rooms: "Linden Court: living room, kitchen, two bedrooms", core: 0.3 },
        { w: 3.6, d: 2.8, rooms: "Apartments", core: 0.3 },
      ],
      unit: 3,
      trees: [[-3, 1.6, 0.9], [3, 1.6, 0.9]],
    },
  },
  {
    slug: "mirador",
    name: "Mirador",
    city: "Barcelona",
    area: "Pedralbes",
    type: "villa",
    beds: 5,
    baths: 5,
    size: 480,
    rent: 12900,
    furnished: false,
    available: "1 January 2027",
    minTerm: "24 months",
    summary: "Cantilevered floors over an infinity pool, with the whole city laid out below.",
    description: [
      "Mirador means viewpoint, and the house is built for it. The upper floor cantilevers four metres past the living room, shading the terrace and framing the city.",
      "The pool runs to the edge of the plot. On clear days you can see the sea past the Sagrada Família.",
    ],
    amenities: ["Infinity pool", "City views", "Double-height living room", "Wine room", "EV charger", "Alarm system"],
    photos: ["miradorPool", "sunRoom", "plantBedroom", "stoneBath"],
    featured: true,
    model: {
      floors: [
        { w: 4.2, d: 3, x: -0.6, rooms: "Double-height living room, kitchen", core: -0.3 },
        { w: 5.6, d: 3, x: 0.6, z: 0.2, rooms: "Four bedrooms, cantilevered over the terrace", core: 0.18 },
        { w: 2.4, d: 2.2, x: -0.8, z: -0.3, rooms: "Main suite and roof deck", core: 0.35 },
      ],
      pool: { w: 4.6, d: 1.4, x: 0.6, z: 3 },
      stair: "right",
      trees: [[-3.8, 1.8, 0.9], [-3.4, -1.6, 1.2]],
    },
  },
  {
    slug: "atelier-loft",
    name: "Atelier Loft",
    city: "Lisbon",
    area: "Príncipe Real",
    type: "loft",
    beds: 1,
    baths: 1,
    size: 84,
    rent: 2900,
    furnished: true,
    available: "Now",
    minTerm: "6 months",
    summary: "A former print workshop turned one-bedroom loft, with herringbone floors and a south wall of windows.",
    description: [
      "The Atelier was a print workshop until the 1990s. It keeps the high ceilings and steel windows, now with herringbone oak floors and a white kitchen.",
      "The bedroom is a raised mezzanine over the bathroom. Príncipe Real's garden and cafés are two minutes away.",
    ],
    amenities: ["4 m ceilings", "Mezzanine bedroom", "Dishwasher", "Fibre internet", "Bike storage"],
    photos: ["blueSofa", "whiteKitchen", "plantLiving"],
    model: {
      floors: [
        { w: 4, d: 2.6, rooms: "Café and entrance", core: 0.5 },
        { w: 4, d: 2.6, rooms: "Atelier Loft: open living, kitchen, mezzanine bedroom", core: 0.15 },
        { w: 4, d: 2.6, rooms: "Studios", core: 0.3 },
      ],
      unit: 1,
      trees: [[3.2, 1.6, 0.8]],
    },
  },
  {
    slug: "kloof-terrace",
    name: "Kloof Terrace",
    city: "Cape Town",
    area: "Tamboerskloof",
    type: "townhouse",
    beds: 3,
    baths: 3,
    size: 210,
    rent: 3800,
    furnished: false,
    available: "1 December 2026",
    minTerm: "12 months",
    summary: "A cedar and white townhouse under Lion's Head, with a roof terrace for sunset.",
    description: [
      "Kloof Terrace is one of four new townhouses on a quiet street under Lion's Head. It has three floors, a small garden and a roof terrace.",
      "It is let unfurnished, with a fitted kitchen and appliances.",
    ],
    amenities: ["Roof terrace", "Garden", "Fitted kitchen", "Secure parking", "Backup power"],
    photos: ["kloofFacade", "yellowChair", "calmBedroom"],
    model: {
      floors: [
        { w: 3, d: 3, rooms: "Kitchen, dining, garden room", core: 0.4 },
        { w: 3, d: 3, z: 0.3, rooms: "Living room and study", core: -0.45 },
        { w: 3, d: 2.6, z: -0.2, rooms: "Three bedrooms", core: 0.3 },
      ],
      timber: true,
      trees: [[-2.8, 1.4, 0.8]],
    },
  },
  {
    slug: "white-patio",
    name: "White Patio",
    city: "Barcelona",
    area: "Sitges",
    type: "townhouse",
    beds: 3,
    baths: 2,
    size: 180,
    rent: 4600,
    furnished: true,
    available: "Now",
    minTerm: "6 months",
    summary: "A whitewashed townhouse built around a shaded patio, five minutes' walk from the beach.",
    description: [
      "White Patio is arranged around an inner courtyard with an olive tree, so every room opens onto shade.",
      "Sitges station is ten minutes away, with trains to Barcelona every twenty minutes.",
    ],
    amenities: ["Inner patio", "Walk to beach", "Outdoor shower", "Air conditioning", "Fibre internet"],
    photos: ["patioCube", "plantLiving", "orangeBed"],
    model: {
      floors: [
        { w: 4, d: 3.2, rooms: "Kitchen, living room, patio", core: 0.55 },
        { w: 3, d: 2.4, x: -0.5, z: -0.3, rooms: "Three bedrooms", core: 0.6 },
      ],
      trees: [[2.6, 1.6, 0.9], [-3, 1.8, 0.7]],
    },
  },
  {
    slug: "shoreline-house",
    name: "Shoreline House",
    city: "Cape Town",
    area: "Camps Bay",
    type: "villa",
    beds: 4,
    baths: 4,
    size: 350,
    rent: 8200,
    furnished: true,
    available: "1 February 2027",
    minTerm: "12 months",
    summary: "A low white villa on the slope above Camps Bay beach, with the Atlantic in every room.",
    description: [
      "Shoreline House sits low on its plot so the neighbours keep their view, and every room faces the sea.",
      "The pool deck steps down to a garden of fynbos. The beach is a short walk downhill.",
    ],
    amenities: ["Ocean views", "Pool deck", "Fynbos garden", "Outdoor kitchen", "Garage", "Backup power"],
    photos: ["shorelineRoof", "openPlan", "luxeBedroom"],
    featured: true,
    model: {
      floors: [
        { w: 6, d: 3, rooms: "Living, dining, kitchen, two suites", core: -0.18 },
        { w: 3.4, d: 2.6, x: 1.2, z: -0.2, rooms: "Main suite, study and terrace", core: 0.25 },
      ],
      pool: { w: 3.6, d: 1.4, x: -1, z: 2.8 },
      trees: [[-4.2, -0.8, 0.9], [4.2, 1.6, 0.8]],
    },
  },
];

export const cities: { name: City; photo: PhotoKey; note: string }[] = [
  { name: "Lisbon", photo: "lisbon", note: "Hillside villas in Cascais and lofts in the old town" },
  { name: "Barcelona", photo: "barcelona", note: "Hilltop homes in Pedralbes and patios on the coast" },
  { name: "Cape Town", photo: "capeTown", note: "Houses between the mountain and the Atlantic" },
  { name: "Dubai", photo: "dubai", note: "Family villas near the beach in Jumeirah" },
  { name: "Paris", photo: "paris", note: "Apartments in restored buildings of the Marais" },
];

export const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "villa", label: "Villa" },
  { value: "house", label: "House" },
  { value: "townhouse", label: "Townhouse" },
  { value: "apartment", label: "Apartment" },
  { value: "loft", label: "Loft" },
];

export const getProperty = (slug: string) => properties.find((p) => p.slug === slug);

export const formatRent = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
