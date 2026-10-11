import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Satori reads TTF, OTF or WOFF (not WOFF2, not variable fonts): static Manrope from @fontsource/manrope.
export const ogFonts = async () => [
  { name: "Manrope", data: await readFile(join(process.cwd(), "src/fonts/manrope-700.woff")), weight: 700 as const },
  { name: "Manrope", data: await readFile(join(process.cwd(), "src/fonts/manrope-500.woff")), weight: 500 as const },
];

export function MarkSvg({ size, ink = "#121418" }: { size: number; ink?: string }) {
  return (
    <svg viewBox="0 0 32 32" width={size} height={size}>
      <path d="M9 15.5a7 7 0 0 1 14 0Z" fill="#e59b55" />
      <rect x="3" y="17.5" width="22" height="3.4" rx="1.7" fill={ink} />
      <rect x="9" y="22.6" width="20" height="3.4" rx="1.7" fill={ink} />
      <rect x="5" y="27.7" width="19" height="3.4" rx="1.7" fill={ink} opacity="0.55" />
    </svg>
  );
}
