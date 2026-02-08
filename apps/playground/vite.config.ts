import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      xontable: path.resolve(__dirname, "../../packages/xontable/src"),
    },
  },
  server: {
    fs: {
      allow: [
        path.resolve(__dirname, "."), // apps/playground
        path.resolve(__dirname, "../../packages"), // packages
      ],
    },
  },
});
