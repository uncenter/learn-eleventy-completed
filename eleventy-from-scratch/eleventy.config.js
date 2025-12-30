// Filters
import { dateFilter } from './src/filters/date-filter.js';
import { w3DateFilter } from './src/filters/w3-date-filter.js';

export default function (eleventyConfig) {
	eleventyConfig.setInputDirectory('src');
	eleventyConfig.setOutputDirectory('dist');

	// Add filters
	eleventyConfig.addFilter('dateFilter', dateFilter);
	eleventyConfig.addFilter('w3DateFilter', w3DateFilter);

	// Set directories to pass through to the dist folder
	eleventyConfig.addPassthroughCopy('src/images');

	// Returns work items, sorted by display order
	eleventyConfig.addCollection('work', (collection) => {
		return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md'));
	});
	// Creates and returns a collection of work that is set to be featured
	eleventyConfig.addCollection('featuredWork', (collection) => {
		return sortByDisplayOrder(collection.getFilteredByGlob('./src/work/*.md')).filter(
			(x) => x.data.featured,
		);
	});
	// Returns a collection of blog posts in reverse date order
	eleventyConfig.addCollection('blog', (collection) => {
		return [...collection.getFilteredByGlob('./src/posts/*.md')].reverse();
	});
	// Returns a list of people ordered by filename
	eleventyConfig.addCollection('people', (collection) => {
		return collection.getFilteredByGlob('./src/people/*.md').sort((a, b) => {
			return Number(a.fileSlug) > Number(b.fileSlug) ? 1 : -1;
		});
	});
}

export const config = {
	markdownTemplateEngine: 'njk',
	htmlTemplateEngine: 'njk',
};

/**
 * Takes a collection and returns it back in display order
 *
 * @param {Array} collection The 11ty collection
 * @returns {Array} the sorted collection
 */
function sortByDisplayOrder(collection) {
	return collection.sort((a, b) =>
		Number(a.data.displayOrder) > Number(b.data.displayOrder) ? 1 : -1,
	);
}
