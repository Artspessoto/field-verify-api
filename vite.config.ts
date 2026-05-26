import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    include: ["src/**/*.spec.ts"],
    exclude: ["node_modules", "build", "dist"],
    environment: "node",
  },
});
