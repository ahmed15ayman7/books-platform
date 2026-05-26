import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./tests/setup.ts"],
    // JWT tests need node environment for crypto
    // Use @vitest-environment node docblock in specific files if needed
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov", "html"],
      include: ["server/services/**", "lib/**"],
      exclude: ["lib/db/**", "lib/i18n/**", "**/*.d.ts"],
      thresholds: {
        global: {
          branches: 50,
          functions: 50,
          lines: 50,
          statements: 50,
        },
      },
    },
    include: ["tests/unit/**/*.test.ts", "tests/integration/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "."),
    },
  },
});
