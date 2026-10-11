# Arise

Website for **Arise**, a company that lets architect-designed homes in Lisbon, Barcelona, Cape Town, Dubai and Paris.

Next.js 16 (App Router, Cache Components) · React 19 · Tailwind CSS 4 · three.js via React Three Fiber · Motion.

## Run it

```bash
npm install
npm run dev -- --port 3500      # or the "arise-dev" entry in .claude/launch.json
```

| Script | What it does |
| --- | --- |
| `npm run build` | Production build (all listings are prerendered) |
| `npm run lint` / `npm run typecheck` | ESLint and TypeScript |
| `npm run test:flow` | Playwright smoke test: search, filters ↔ URL, lightbox, 3D controls, forms, mobile menu, 404 |
| `npm run test:a11y` | axe WCAG 2.1 AA scan of every route |
| `npm run screenshots -- <dir> / /rentals` | Full-page captures at 1440 / 768 / 390 px |
| `npm run photos` | Downloads the Unsplash photos in `src/data/photos.ts` (add `--force` to refresh) |
| `npm run assets:3d` | Downloads and compresses the CC0 HDRIs, textures and models for the 3D scenes |

The test scripts expect a server on `http://localhost:3500` (override with `BASE_URL`).

## Design

"First light": the name means sunrise, so time of day is the signature.

- **Hero.** A photograph of a white villa (Unsplash) whose sky dissolves into the page sky. There's no WebGL here, so it shows instantly. The entrance runs in CSS from the server-rendered HTML, and depth comes from layering: the house settles in on load, drifts slower than the page on scroll and leans toward the pointer.
- **3D.** It lives further down: the "See every level" section on the home page and the tour on each listing. three.js and the 3D assets only download when one of these sections comes within 600 px of the viewport.
- **Palette.** Sky `#CFE4F3`, white, ink `#121418`, stone grey `#5C636D`. The dusk accent `#E59B55` is used sparingly. Primary actions are black pills.
- **Type.** Manrope, self-hosted in `src/fonts`, with tight tracking on display sizes.
- **Logo.** A half sun rising behind three cantilevered slabs (`src/components/brand/logo.tsx`).

## UI components

Dropdowns and the date picker use [shadcn/ui](https://ui.shadcn.com) on Radix: `select`, `popover` and `calendar` (react-day-picker), restyled for Arise in `src/components/ui/`. Add more with `npx shadcn@latest add <name>`. shadcn's theme tokens (`--background`, `--popover`, `--ring` and so on) are mapped onto the Arise palette at the bottom of `globals.css`. There is no dark mode.

- `src/components/ui/pill-button.ts` holds the site's own pill button classes. `ui/button.tsx` is shadcn's Button, used inside the calendar.
- Form wrappers live in `src/components/forms/fields.tsx`: `SelectField` and `DateField`. They submit through hidden inputs, so `FormData` and the stub API routes work unchanged. When validation fails, focus moves to the trigger marked `data-field`.

## 3D

The architecture is generated in code from each listing's `model` in `src/data/properties.ts`. Everything that makes it look photographic comes from CC0 assets from [Poly Haven](https://polyhaven.com). `npm run assets:3d` downloads and compresses them to about 8.6 MB in `public/3d/`; raw downloads are cached in `.assets-raw/`, which is git-ignored.

- **Image-based lighting:** two photographed skies, a day sky (`kloofendal_48d_partly_cloudy_puresky`) and a sunset (`qwantani_sunset_puresky`). They light the scene and show up in the glass and water reflections.
- **PBR textures:** plaster render, cedar cladding, terrace tiles, grass and oak flooring, mapped with world-scaled UVs (`worldBox`) so textures never stretch.
- **Scanned models:** an olive-like tree, shrubs, a potted plant, a sofa, a lounge chair and a coffee table, simplified and compressed with meshopt (`src/components/three/props.tsx`).
- **Rendering** (`stage.tsx`): a sun with soft variance shadows, a sky dome with a sun glow, and horizon fog. Post-processing adds N8AO ambient occlusion, bloom for the lit windows at dusk, neutral PBR tone mapping, a light vignette and SMAA.
- **Performance:** the shadow map is redrawn only when the sun or the house moves. The camera orbits instead of the house spinning. Resolution adapts to the frame rate (`adaptive-dpr.tsx`), and canvases pause off screen. It runs at about 30 fps on an Intel UHD 620.
- **Files:** `villa.tsx` holds the levels, glazing, furnished rooms, terrace, pool, planting, the rise entrance, exploded levels and the dusk glow. `model-scene.tsx` is the orbit viewer.
- **Fallbacks:** scenes load client-side only, behind a WebGL check. The rise and the orbit are skipped under `prefers-reduced-motion`.

## Placeholders to replace before launch

- **Listings, people, quotes and office addresses are fictional.** Rents are shown in euros everywhere so that the filters compare like with like.
- **Forms are front-end only.** `src/app/api/enquiry/route.ts` (viewing, owner and contact) and `src/app/api/subscribe/route.ts` validate the input, log it and return success. Connect them to email or a CRM.
- **`site.url`, email and phone** are in `src/lib/utils.ts`.
- **Photography** is from Unsplash (free licence), self-hosted in `public/images/photos`.
