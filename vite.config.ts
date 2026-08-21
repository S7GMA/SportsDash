import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

const browserUA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36';

const proxy = {
  '/api/espn': {
    target: 'https://site.web.api.espn.com',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/espn/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
  '/api/jolpica': {
    target: 'https://api.jolpi.ca',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/jolpica/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
  '/api/openf1': {
    target: 'https://api.openf1.org',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/openf1/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
  '/api/mlb': {
    target: 'https://statsapi.mlb.com',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/mlb/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
  '/api/wiki': {
    target: 'https://en.wikipedia.org',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/wiki/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
  '/api/sportsdb': {
    target: 'https://www.thesportsdb.com',
    changeOrigin: true,
    rewrite: (p: string) => p.replace(/^\/api\/sportsdb/, ''),
    headers: { 'User-Agent': browserUA, Accept: 'application/json' },
  },
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  base: './',
  server: { port: 5173, host: true, proxy },
  preview: { port: 4173, host: true, proxy },
});
