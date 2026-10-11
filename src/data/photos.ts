// Photography from Unsplash (https://unsplash.com/license), free for commercial use.
// `npm run photos` downloads each one once as public/images/photos/<name>.webp; next/image
// does the resizing, so the site never hotlinks the Unsplash CDN.

export interface Photo {
  name: string;
  cdn: string;
  alt: string;
  width: number;
  /** imgix crop ratio, e.g. "1:1" */
  aspect?: string;
}

const u = (id: string) => `https://images.unsplash.com/photo-${id}`;

export const photos = {
  // Exteriors
  heroVilla: { name: "hero-villa", cdn: u("1613977257363-707ba9348227"), alt: "A white two-storey modern villa with a covered terrace and a pool, under a clear sky", width: 2400 },
  albaPool: { name: "alba-pool", cdn: u("1600596542815-ffad4c1539a9"), alt: "A white three-storey villa with a rooftop terrace behind a long turquoise pool", width: 2000 },
  eavesDusk: { name: "eaves-dusk", cdn: u("1600585154340-be6161a56a0c"), alt: "A dark timber house at dusk, its glass living room lit warm under a large tree", width: 2000 },
  solaceFront: { name: "solace-front", cdn: u("1613490493576-7fde63acd811"), alt: "A white villa with a timber soffit and floor-to-ceiling glass facing a long pool", width: 2000 },
  miradorPool: { name: "mirador-pool", cdn: u("1580587771525-78b9dba3b914"), alt: "A modern house with cantilevered white floors above an infinity pool", width: 2000 },
  kloofFacade: { name: "kloof-facade", cdn: u("1600047509807-ba8f99d2cdde"), alt: "A townhouse facade of white render, grey panels and warm cedar cladding", width: 2000 },
  patioCube: { name: "patio-cube", cdn: u("1523217582562-09d0def993a6"), alt: "A white cubic house with deep-set windows behind a stone path", width: 2000 },
  shorelineRoof: { name: "shoreline-roof", cdn: u("1597211833712-5e41faa202ea"), alt: "A low white house on the coast with the sea beyond its roofline", width: 2000 },
  singleStorey: { name: "single-storey", cdn: u("1512917774080-9991f1c4c750"), alt: "A single-storey white house with sliding glass walls beside a pool and palms", width: 2000 },
  terraceSunset: { name: "terrace-sunset", cdn: u("1599809275671-b5942cabc7a2"), alt: "A pool terrace and fire pit at sunset in front of a warm stone house", width: 2000 },
  villaSymmetry: { name: "villa-symmetry", cdn: u("1602343168117-bb8ffe3e2e9f"), alt: "A symmetrical white villa with glass balconies above a wide pool", width: 2000 },
  timberHouse: { name: "timber-house", cdn: u("1600566753190-17f0baa2a6c3"), alt: "A two-storey house clad in pale timber and black panels on a quiet street", width: 2000 },
  facadeNight: { name: "facade-night", cdn: u("1600585154526-990dced4db0d"), alt: "A dark-panelled facade with slatted timber, lit from inside at night", width: 2000 },
  entryDusk: { name: "entry-dusk", cdn: u("1494526585095-c41746248156"), alt: "A house entrance with lit wall lamps and steps under a pink dusk sky", width: 2000 },

  // Interiors
  openPlan: { name: "open-plan", cdn: u("1600607687939-ce8a6c25118c"), alt: "An open-plan living room with a white sofa, walnut wall and kitchen beyond", width: 1600 },
  sunRoom: { name: "sun-room", cdn: u("1600210492486-724fe5c67fb0"), alt: "A double-height living room with leather sofa, plants and a framed photo grid", width: 1600 },
  plantLiving: { name: "plant-living", cdn: u("1502672260266-1c1ef2d93688"), alt: "A bright apartment living room with bookshelves, plants and a grey sofa", width: 1600 },
  aptKitchen: { name: "apt-kitchen", cdn: u("1522708323590-d24dbb6b0267"), alt: "An apartment kitchen-lounge with a red armchair and tall windows", width: 1600 },
  blueSofa: { name: "blue-sofa", cdn: u("1493809842364-78817add7ffb"), alt: "A sunny loft with a blue velvet sofa, herringbone floor and low white cabinets", width: 1600 },
  whiteKitchen: { name: "white-kitchen", cdn: u("1484154218962-a197022b5858"), alt: "A white kitchen with black pendant lights and stools at the island", width: 1600 },
  classicLounge: { name: "classic-lounge", cdn: u("1505691938895-1758d7feb511"), alt: "A classic lounge with a white sofa, navy cushions and tall shuttered windows", width: 1600 },
  orangeBed: { name: "orange-bed", cdn: u("1540518614846-7eded433c457"), alt: "A bedroom with orange benches at the foot of a white bed and a red painting above", width: 1600 },
  whiteBath: { name: "white-bath", cdn: u("1552321554-5fefe8c9ef14"), alt: "A white bathroom with a sash window and a trailing plant", width: 1600 },
  glassStair: { name: "glass-stair", cdn: u("1600573472550-8090b5e0745e"), alt: "A floating timber staircase beside a glass wall that opens onto the pool", width: 1600 },
  yellowChair: { name: "yellow-chair", cdn: u("1586023492125-27b2c045efd7"), alt: "A yellow armchair beside a brass floor lamp and framed print", width: 1600 },
  plantBedroom: { name: "plant-bedroom", cdn: u("1615874959474-d609969a20ed"), alt: "A soft green bedroom with hanging plants and a rattan pendant", width: 1600 },
  luxeBedroom: { name: "luxe-bedroom", cdn: u("1616594039964-ae9021a400a0"), alt: "A bedroom with a channel-tufted bed, brass chandelier and city views", width: 1600 },
  windowLounge: { name: "window-lounge", cdn: u("1618221195710-dd6b41faaea6"), alt: "A long living room with a grey sofa, leather pouffes and a ribbon window", width: 1600 },
  calmBedroom: { name: "calm-bedroom", cdn: u("1600607687644-c7171b42498f"), alt: "A calm white bedroom with tall glass doors to the garden", width: 1600 },
  stoneBath: { name: "stone-bath", cdn: u("1600566752355-35792bedcfea"), alt: "A grey stone bathroom with a freestanding tub and clerestory window", width: 1600 },
  greenDining: { name: "green-dining", cdn: u("1617806118233-18e1de247200"), alt: "A dining room with green velvet chairs around a set table", width: 1600 },

  // Cities
  lisbon: { name: "lisbon", cdn: u("1585208798174-6cedd86e019a"), alt: "A yellow tram on a cobbled Lisbon street between pastel facades", width: 1200, aspect: "4:5" },
  barcelona: { name: "barcelona", cdn: u("1583422409516-2895a77efded"), alt: "Barcelona's Eixample grid seen from above, with the Sagrada Família", width: 1200, aspect: "4:5" },
  capeTown: { name: "cape-town", cdn: u("1580060839134-75a5edca2e99"), alt: "Cape Town between Table Mountain and the Atlantic", width: 1200, aspect: "4:5" },
  dubai: { name: "dubai", cdn: u("1512453979798-5ea266f8880c"), alt: "Dubai's skyline and highway interchanges at sunrise", width: 1200, aspect: "4:5" },
  paris: { name: "paris", cdn: u("1502602898657-3e91760cbb34"), alt: "The Eiffel Tower and the Seine under a violet evening sky", width: 1200, aspect: "4:5" },

  // People
  personInes: { name: "person-ines", cdn: u("1544005313-94ddf0286df2"), alt: "Portrait of Inês Moreau", width: 600, aspect: "1:1" },
  personDaniel: { name: "person-daniel", cdn: u("1500648767791-00dcc994a43e"), alt: "Portrait of Daniel Okafor", width: 600, aspect: "1:1" },
  personClara: { name: "person-clara", cdn: u("1438761681033-6461ffad8d80"), alt: "Portrait of Clara Lindqvist", width: 600, aspect: "1:1" },
  personMarc: { name: "person-marc", cdn: u("1472099645785-5658abf4ff4e"), alt: "Portrait of John Doe", width: 600, aspect: "1:1" },
  personAmira: { name: "person-amira", cdn: u("1534528741775-53994a69daeb"), alt: "Portrait of Jane Dawson", width: 600, aspect: "1:1" },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photos;

export const photoSrc = (key: PhotoKey) => `/images/photos/${photos[key].name}.webp`;
