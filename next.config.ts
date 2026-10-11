import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    // The dev disk cache kept serving stale globals.css output across restarts with the
    // @tailwindcss/turbopack loader (seen on GearTrove). Production builds keep their cache.
    turbopackFileSystemCacheForDev: false,
  },
  turbopack: {
    // Pin the root: /home/harry/Projects is itself a repo and confuses auto-detection.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
