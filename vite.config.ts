import path from 'path';
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default ({ mode }) => {
  // Load app-level env vars to node-level env vars.
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return defineConfig({
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
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
    },
    plugins: [
      react(),
      viteTsconfigPaths(),
      // svgr options: https://react-svgr.com/docs/options/
      svgr({ svgrOptions: { icon: true } }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './tests/vite-setup.ts',
    },
  });
};
