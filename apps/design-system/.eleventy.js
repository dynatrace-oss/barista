const markdownIt = require('markdown-it');
const md = markdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

module.exports = function (config) {
  config.addFilter('markdownify', function (input) {
    return md.render(input);
  });

  config.addPassthroughCopy({
    'apps/design-system/_styles/*.css': 'assets/css',
    'apps/design-system/bundle.js': 'assets/js/main.js',
  });

  config.addFilter('log', function (input) {
    console.log('🤡', input);
    return input;
  });

  return {
    dir: {
      input: 'apps/design-system/',
      includes: '_includes',
      data: '_data',
      output: 'dist',
    },
    // passthroughFileCopy: true,
  };
};
