/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const { resolve, join } = require('path');

/**
 * Extension of the webpack configuration.
 * We are doing this to fix the builder setup once for all
 * custom-element builds.
 * Additionally, we will eventually need scss imports, which
 * will require a webpack-scss loader.
 */
module.exports = (config) => {
  // Setup build outputs
  config.output.filename = 'index.js';
  config.output.libraryTarget = 'commonjs-module';

  // Setup scss loader to make sure that we can load scss files
  // for the components
  config.module.rules.unshift({
    include: [join(process.cwd(), 'libs/fluid-elements/')],
    test: /\.css|\.s(c|a)ss$/,
    use: [
      { loader: resolve(__dirname, './lit-elements-loader.js') },
      { loader: 'extract-loader' },
      { loader: 'css-loader' },
      {
        loader: 'sass-loader',
        options: {
          sassOptions: {
            includePaths: [
              '../../node_modules',
              '../../libs/shared/design-tokens/generated/',
            ],
          },
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
