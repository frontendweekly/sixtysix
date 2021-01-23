// Import plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');
const markdown = require('@frontendweekly/eleventy-plugin-markdown');
// Import filters
const filterDateOrdinalSuffix = require('@frontendweekly/filter-date-ordinal-suffix');
const filterDateIso = require('@frontendweekly/filter-date-iso');
const filterTagsToSentence = require('@frontendweekly/filter-tags-to-sentence');

// Import transforms
const transformHtmlMin = require('@frontendweekly/transform-htmlmin');
const transformEnhancePostIframe = require('@frontendweekly/transform-enhance-post-iframe');
const transformEnhancePostCodeBlock = require('@frontendweekly/transform-enhance-post-code-block');

// Import collection
const collectionPost = require('@frontendweekly/collection-posts');

module.exports = function (config) {
  // Watch postcss
  config.addWatchTarget('./11ty/_postcss/');

  // Plugins
  config.addPlugin(rssPlugin);
  config.setLibrary('md', markdown);

  // Filters
  config.addFilter('dateOrdinalSuffixFilter', filterDateOrdinalSuffix);
  config.addFilter('dateIsoFilter', filterDateIso);
  config.addFilter('tagsToSentence', filterTagsToSentence);

  // Transforms
  config.addTransform('enhancePostIframe', transformEnhancePostIframe);
  config.addTransform('enhancePostCodeBlock', transformEnhancePostCodeBlock);
  config.addTransform('htmlmin', transformHtmlMin);

  // Passthrough copy
  config.addPassthroughCopy('src/favicon.*');
  config.addPassthroughCopy('src/humans.txt');

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Custom collections
  config.addCollection('posts', (collection) =>
    collectionPost(collection, './11ty/posts/*.md')
  );

  return {
    dir: {
      input: '11ty',
      output: 'dist',
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};
