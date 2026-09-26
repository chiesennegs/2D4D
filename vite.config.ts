import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // Relative base so the build works unchanged whether it's served from
  // GitHub Pages' default subpath (https://user.github.io/2D4D/) or from a
  // custom domain at the root later — no config change needed either way.
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg"],
      manifest: {
        name: "2D4D digit ratio estimator",
        short_name: "2D4D",
        description:
          "Estimate your 2D:4D digit ratio against published population data, entirely on your device.",
        theme_color: "#0f1115",
        background_color: "#0f1115",
        display: "standalone",
        icons: [
          {
            src: "favicon.svg",
            sizes: "any",
            type: "image/svg+xml",
          },
        ],
      },
    }),
  ],
});
