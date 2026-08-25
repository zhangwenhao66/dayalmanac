// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import { sitemapConfig } from './vendor/site-toolkit/packages/sitemap-config/src/index.ts';

// https://astro.build/config
export default defineConfig({
	site: 'https://dayalmanac.com',
	integrations: [mdx(), sitemap(sitemapConfig({ excludePaths: ['/embed/'] }))],
	build: {
		inlineStylesheets: 'always',
	},
	vite: {
		plugins: [tailwindcss()],
	},
});
