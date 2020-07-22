const markdownIt = require('markdown-it');
const md = markdownIt();

module.exports = function (config) {
  config.addFilter('markdownify', function (input) {
    return md.render(input);
  });
  config.addPassthroughCopy({
    'apps/design-system/_styles/*.css': 'assets/css',
    'apps/design-system/_scripts/*.js': 'assets/js',
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
