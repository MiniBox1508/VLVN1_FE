import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // <-- BẮT BUỘC CÓ DÒNG NÀY

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- VÀ DÒNG NÀY
  ],
});
