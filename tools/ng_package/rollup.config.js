const { join } = require('path');
const { sync } = require('glob');

// will be replaced via bazels expand_template substitutions
const BASE_PATH = '{base_path}';
const ENTRY_POINT_NAME = '{entry_point_name}';
const BUNDLE_NAME = '{bundle_name}';

const plugins = [];

const commonOutput = {
  globals: '{rollup_globals}',
  sourcemap: true,
};

const external = '{rollup-externals}';

export default (args) => {
  return [
    {
      input: join(BASE_PATH, `esm5/${ENTRY_POINT_NAME}.js`),
      output: [
        {
          file: join(BASE_PATH, `fesm5/${BUNDLE_NAME}.js`),
          format: 'es',
          ...commonOutput,
        },
      ],
      external,
      plugins,
    },
    {
      input: join(BASE_PATH, `${ENTRY_POINT_NAME}.mjs`),
      output: [
        {
          file: join(BASE_PATH, `fesm2015/${BUNDLE_NAME}.js`),
          format: 'es',
          ...commonOutput,
        },
        {
          file: join(BASE_PATH, `bundles/${BUNDLE_NAME}.umd.js`),
          name: BUNDLE_NAME,
          format: 'umd',
          ...commonOutput,
        },
      ],
      external,
      plugins,
    },
  ];
};
