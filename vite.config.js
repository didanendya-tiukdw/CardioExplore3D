import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const projectRoot = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: `${projectRoot}index.html`,
        'all-levels': `${projectRoot}all-levels.html`,
        'levels/scene-01': `${projectRoot}levels/scene-01.html`,
        'levels/scene-02': `${projectRoot}levels/scene-02.html`,
        'levels/scene-03': `${projectRoot}levels/scene-03.html`,
        'levels/scene-04': `${projectRoot}levels/scene-04.html`,
        'levels/scene-05': `${projectRoot}levels/scene-05.html`,
        'levels/scene-06': `${projectRoot}levels/scene-06.html`,
        'levels/scene-07': `${projectRoot}levels/scene-07.html`,
        'levels/scene-08': `${projectRoot}levels/scene-08.html`,
        'levels/scene-09': `${projectRoot}levels/scene-09.html`,
        'levels/scene-10': `${projectRoot}levels/scene-10.html`,
        'levels/scene-11': `${projectRoot}levels/scene-11.html`,
        'levels/scene-12': `${projectRoot}levels/scene-12.html`,
      },
    },
  },
});
