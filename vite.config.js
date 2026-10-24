import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ command, mode }) => {
  const isSSR = mode === 'ssr';

  return {
    plugins: [react({
      include: /\.(jsx|js|tsx|ts)$/,
    })],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      outDir: isSSR ? 'dist/server' : 'dist/client',
      manifest: true,
      rollupOptions: {
        input: isSSR 
          ? path.resolve(__dirname, 'src/server/server.js')
          : path.resolve(__dirname, 'src/browser/client.jsx'),
        output: {
          // 💡 關鍵：強制 SSR 輸出格式為 CommonJS (cjs)，並命名為 server.cjs
          format: isSSR ? 'cjs' : 'es',
          entryFileNames: isSSR ? 'server.cjs' : 'client.js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]'
        },
        external: [
          'express', 'fs', 'path', 'http', 'https', 'crypto', 'os', 'url', 
          'querystring', 'stream', 'util', 'zlib', 'net', 'events', 'buffer'
        ],
      },
    },
    ssr: {
      target: 'node',
    },
  };
});