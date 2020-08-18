const markdownIt = require('markdown-it');
const { readdirSync } = require('fs');
const { join } = require('path');

const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

const {
  ELEVENTY_BASE_DIR,
  ELEVENTY_ROOT_DIR,
  ELEVENTY_OUTPUT_DIR,
  ELEVENTY_INCLUDES_DIR,
  ELEVENTY_DATA_DIR,
} = process.env;

module.exports = function (config) {
  config.addFilter('markdownify', (input) => md.render(input));

  // config.addPassthroughCopy({
  //   'apps/design-system/_styles/*.css': 'assets/css',
  //   'apps/design-system/bundle.js': 'assets/js/main.js',
  // });

  config.addFilter('log', function (input) {
    console.log('🤡', input);
    return input;
  });

  return {
    dir: {
      input: ELEVENTY_BASE_DIR,
      includes: ELEVENTY_INCLUDES_DIR,
      data: ELEVENTY_DATA_DIR,
      output: ELEVENTY_OUTPUT_DIR,
    },
  };
};
