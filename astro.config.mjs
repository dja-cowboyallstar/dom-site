// @ts-check
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://dominickamirr.com', // change to your real domain
  output: 'server', // SSR mode for the /api/ask-abacus endpoint
  adapter: vercel({
    webAnalytics: { enabled: true },
    imageService: true,
  }),
  integrations: [mdx(), sitemap()],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
