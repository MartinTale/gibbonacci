import { js13kViteConfig } from "js13k-vite-plugins";
import { defineConfig } from "vite";

// @ts-ignore
export default defineConfig((configEnv) => {
	return js13kViteConfig({
		closureOptions: false,
		// roadrollerOptions: configEnv.mode === "development" ? false : undefined,
	});
});
