import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/tp1-lenguajesIV/TP2/", // Respetar minúsculas/mayúsculas igual a la URL
});
