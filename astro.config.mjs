import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  // Add this Vite configuration to inline CSS
  vite: {
    build: {
      // This tells Vite (Astro's underlying build tool) to not split CSS into separate files.
      cssCodeSplit: false,
      // This ensures the CSS is inlined into a <style> tag in the HTML head.
      assetsInlineLimit: 0,
    },
  },
});
