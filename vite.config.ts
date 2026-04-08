import path from 'path';

import eslint from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig(() => {
  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern' as const,
        },
      },
    },
    define: {
      'process.env': '{}',
    },
    envPrefix: 'VITE_',
    resolve: {
      tsconfigPaths: true,
      alias: {
        '~styles': path.resolve(__dirname, './src/assets/styles'),
        '~hds-design-tokens': path.resolve(
          __dirname,
          './node_modules/hds-design-tokens'
        ),
      },
    },
    optimizeDeps: {
      include: ['redux-persist'],
    },
    build: {
      outDir: 'build',
      sourcemap: true,
    },
    server: {
      port: parseInt(process.env.PORT || '3000'),
      open: true,
    },
    preview: {
      port: parseInt(process.env.PORT || '3000'),
    },
    plugins: [
      react(),
      eslint(),
      // svgr options: https://react-svgr.com/docs/options/
      svgr({ svgrOptions: { icon: true } }),
    ],
  };
});
