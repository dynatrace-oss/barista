const { join } = require('path');

module.exports = (config) => {
  // To prevent double compilation and a mixup between
  // Angular scss parsing and the ones done for lit-elements
  // we neet to explicitly exclude fluid elements for all
  // angular specific scss loading.
  for (const rule of config.module.rules) {
    if (rule.test.toString().includes('scss')) {
      rule.exclude = rule.exclude || [];
      rule.exclude.push(join(process.cwd(), 'libs/fluid-elements/'));
    }
  }

  // Setup scss loader for the fluid-elements scss loading
  config.module.rules.push({
    include: [join(process.cwd(), 'libs/fluid-elements/')],
    test: /\.css|\.s(c|a)ss$/,
    use: [
      {
        loader: join(
          process.cwd(),
          'libs/fluid-elements/lit-elements-loader.js',
        ),
      },
      { loader: 'extract-loader' },
      { loader: 'css-loader' },
      {
        loader: 'sass-loader',
        options: {
          sassOptions: { includePaths: ['../../node_modules'] },
        },
      },
    ],
  });

  // Add the design tokens as an alias,
  // to be able to import from them.
  config.resolve.extensions.push('.scss');
  config.resolve.alias['@dynatrace/fluid-design-tokens'] = join(
    process.cwd(),
    'libs/shared/design-tokens/generated/',
  );
  return config;
};
