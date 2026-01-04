import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import dts from "unplugin-dts/vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "components",
      fileName: "index",
      formats: ["es"],
    },
    rolldownOptions: {
      external: ["three", /three\//, "camera-controls", "style-observer"],
      output: {
        globals: { THREE: "three" },
      },
    },
  },
  plugins: [dts()],
});
