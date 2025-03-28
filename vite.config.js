import { defineConfig } from "vite"; // 🔹 IMPORTACIÓN CORRECTA
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import ViteFonts from "unplugin-fonts/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    Vue({ template: { transformAssetUrls } }),
    Vuetify(),
    Components(),
    ViteFonts({
      google: {
        families: [{ name: "Roboto", styles: "wght@100;300;400;500;700;900" }],
      },
    }),
  ],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  server: { port: 3000 },
  build: { outDir: "dist", emptyOutDir: true },
});
