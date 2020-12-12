// Import plugins
const rssPlugin = require('@11ty/eleventy-plugin-rss');

const molle = require('@frontendweekly/molle');
const collectionPost = require('@frontendweekly/collection-posts');

module.exports = function (config) {
  // Watch postcss
  config.addWatchTarget('./src/_postcss/');

  // Plugins
  config.addPlugin(rssPlugin);
  config.addPlugin(molle);

  // Passthrough copy
  config.addPassthroughCopy('src/favicon.*');
  config.addPassthroughCopy('src/humans.txt');

  // Layout aliases
  config.addLayoutAlias('home', 'layouts/home.njk');

  // Custom collections
  config.addCollection('posts', (collection) => collectionPost(collection));

  return {
    dir: {
      input: 'src',
      output: 'dist',
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};
