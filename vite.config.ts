/// <reference types="vitest/config"/>
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";

export default defineConfig({
	plugins: [
		react(),
		checker({
			typescript: true,
			biome: { command: "check" },
		}),
		visualizer({ filename: "bundle-stats.html", open: true, brotliSize: true }),
	],
	test: {
		globals: true,
		environment: "jsdom",
		setupFiles: "src/__tests__/setupTest.ts",
		coverage: {
			provider: "v8",
			exclude: ["api/generatedApi.ts"],
		},
	},
});
