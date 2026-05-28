import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

// Lightweight Vitest setup for pure-logic (money/business) unit tests.
// No DOM/network/DB: tests run in a node environment against TypeScript modules.
export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    exclude: ["node_modules", ".next", "dist"],
  },
});
