import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

// Extract date from filename (YYYY-MM-DD-slug.md) or use frontmatter
function extractDate(post) {
	const match = post.id.match(/^(\d{4})-(\d{2})-(\d{2})-/);
	if (match) {
		return new Date(`${match[1]}-${match[2]}-${match[3]}`);
	}
	return post.data.pubDate;
}

export async function GET(context) {
	const posts = await getCollection('blog');
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			...post.data,
			pubDate: extractDate(post),
			link: `/blog/${post.id}/`,
		})),
	});
}
