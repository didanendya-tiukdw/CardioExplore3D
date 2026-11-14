import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));
const levels = Array.from({ length: 12 }, (_, index) => {
  const number = String(index + 1).padStart(2, '0');
  return [`scene-${number}`, resolve(projectRoot, `levels/scene-${number}.html`)];
});

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        home: resolve(projectRoot, 'index.html'),
        catalog: resolve(projectRoot, 'all-levels.html'),
        ...Object.fromEntries(levels)
      }
    }
  }
});
