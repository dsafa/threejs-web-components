import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command }) => ({
  base: command === "build" ? "/threejs-web-components/" : undefined,
  build: {
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        commands: resolve(__dirname, "commands.html"),
        glb: resolve(__dirname, "glb.html"),
        html: resolve(__dirname, "html-elements.html"),
        instancing: resolve(__dirname, "instancing.html"),
        interactive: resolve(__dirname, "interactive.html"),
        styling: resolve(__dirname, "styling.html"),
      },
      output: {
        advancedChunks: {
          groups: [
            {
              name: "three",
              test: /node_modules[\\/]three/,
            },
          ],
        },
      },
    },
  },
}));
