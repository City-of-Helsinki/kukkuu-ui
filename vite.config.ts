/* eslint-disable import/no-anonymous-default-export */
import path from 'path';

import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';
import eslint from 'vite-plugin-eslint';

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern',
        },
      },
    },
    define: {
      'process.env': process.env,
    },
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
      watch: {
        usePolling: Boolean(process.env.NODE_ENV === 'development'),
      },
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
  });
};
