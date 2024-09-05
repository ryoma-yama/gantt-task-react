import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	server: {
		port: 5174,
	},
	plugins: [react()],
	test: {
		globals: true,
		environment: "happy-dom",
	},
	base: "/gantt-task-react/",
});
