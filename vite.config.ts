import path from 'path';

import { thirdPartyLicenses } from '@city-of-helsinki/license-notices';
import eslint from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

import { thirdPartyLicensesConfig } from './scripts/thirdPartyLicenses.config';

export default defineConfig(({ mode }) => {
  return {
    css: {
      preprocessorOptions: {
        scss: {},
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
      mode !== 'test' && eslint(),
      // svgr options: https://react-svgr.com/docs/options/
      svgr({ svgrOptions: { icon: true } }),
      thirdPartyLicenses(thirdPartyLicensesConfig),
    ],
  };
});
