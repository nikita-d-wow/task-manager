import { defineConfig } from "vitest/config"; // ✅ <-- import from vitest/config
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  test: {
    globals: true,
    environment: "jsdom", // for React DOM tests
    setupFiles: "./src/tests/setupTests.ts",
    css: true, // allows importing CSS in tests
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
