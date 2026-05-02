import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export const prerender = true;

export async function GET(context: APIContext) {
  const entries = (await getCollection('writing', ({ data }) => !data.draft))
    .sort((a, b) => b.data.pubDate.getTime() - a.data.pubDate.getTime());

  return rss({
    title: 'Dominick Amirr | Writing',
    description: 'Notes on agents, finance systems, and the slow work of building software that ties out.',
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.pubDate,
      link: `/writing/${entry.id}/`,
    })),
    customData: '<language>en-us</language>',
  });
}
