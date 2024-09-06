import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";

export default defineConfig({
	plugins: [react()],
	build: {
		lib: {
			entry: "src/index.tsx",
			name: "NeoGanttTaskReact",
			formats: ["es"],
			fileName: "index.modern",
		},
		rollupOptions: {
			external: ["react", "react-dom"],
			output: {
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
			},
		},
	},
	test: {
		globals: true,
		environment: "happy-dom",
	},
});
