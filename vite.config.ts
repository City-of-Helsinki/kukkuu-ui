/* eslint-disable import/no-anonymous-default-export */
import path from 'path';

import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import eslint from 'vite-plugin-eslint';
import svgr from 'vite-plugin-svgr';
import viteTsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig(() => {
  return {
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern' as const,
        },
      },
    },
    envPrefix: 'VITE_',
    resolve: {
      alias: {
        '~styles': path.resolve(__dirname, './src/assets/styles'),
        '~hds-design-tokens': path.resolve(
          __dirname,
          './node_modules/hds-design-tokens'
        ),
      },
    },
    build: {
      outDir: 'build',
    },
    server: {
      port: parseInt(process.env.PORT) || 3000,
      open: true,
    },
    preview: {
      port: parseInt(process.env.PORT) || 3000,
    },
    plugins: [
      react(),
      eslint(),
      viteTsconfigPaths(),
      // svgr options: https://react-svgr.com/docs/options/
      svgr({ svgrOptions: { icon: true } }),
    ],
  };
});
