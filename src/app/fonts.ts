import localFont from "next/font/local";

// Self-hosted (from @fontsource-variable/manrope) so builds never depend on reaching Google Fonts.
export const manrope = localFont({
  src: "../fonts/manrope.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});
