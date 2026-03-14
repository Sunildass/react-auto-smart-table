import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: "/react-auto-smart-table/",
  plugins: [react()],
  resolve: {
    alias: {
      "react-auto-smart-table": path.resolve(__dirname, "../dist/index.mjs"),
    },
  },
});
