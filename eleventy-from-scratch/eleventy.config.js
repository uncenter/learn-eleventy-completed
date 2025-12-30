import rssPlugin from '@11ty/eleventy-plugin-rss';
import { RenderPlugin } from "@11ty/eleventy";
import { eleventyImageTransformPlugin } from '@11ty/eleventy-img';

// Filters
import { dateFilter } from './src/filters/date-filter.js';
import { w3DateFilter } from './src/filters/w3-date-filter.js';

import path from 'node:path';
import * as sass from 'sass';

export default function (eleventyConfig) {
	eleventyConfig.setInputDirectory('src');
	eleventyConfig.setOutputDirectory('dist');

	// Add filters
	eleventyConfig.addFilter('dateFilter', dateFilter);
	eleventyConfig.addFilter('w3DateFilter', w3DateFilter);

	// Set directories to pass through to the dist folder
	eleventyConfig.addPassthroughCopy('src/fonts');

	// Plugins
	eleventyConfig.addPlugin(rssPlugin);
	eleventyConfig.addPlugin(RenderPlugin);
	eleventyConfig.addPlugin(eleventyImageTransformPlugin);

	eleventyConfig.addExtension('scss', {
		outputFileExtension: 'css',
		useLayouts: false,
		compile: async function (inputContent, inputPath) {
			let parsed = path.parse(inputPath);
			// Don’t compile file names that start with an underscore
			if (parsed.name.startsWith('_')) {
				return;
			}

			const compiled = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || '.', this.config.dir.includes],
				silenceDeprecations: ['import', 'global-builtin', 'slash-div']
			});

			// Map dependencies for incremental builds
			this.addDependencies(inputPath, compiled.loadedUrls);

			return async (data) => {
				return compiled.css;
			};
		},
	});

	eleventyConfig.addTemplateFormats('scss');

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
