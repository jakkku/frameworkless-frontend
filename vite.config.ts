import { defineConfig } from "vite";
import { resolve } from "path";

const root = resolve(__dirname, "src");
const outDir = resolve(__dirname, "dist");

export default defineConfig({
  root,
  build: {
    outDir,
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        "chapter2-3": resolve(root, "chapter/2-3/index.html"),
        chapter4: resolve(root, "chapter/4/index.html"),
        chapter6: resolve(root, "chapter/6/index.html"),
      },
    },
  },
});
