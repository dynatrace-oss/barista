const { join } = require('path');
const { sync } = require('glob');

// will be replaced via bazels expand_template substitutions
const BASE_PATH = '{base_path}';
const ENTRY_POINT_NAME = '{entry_point_name}';

const plugins = [];

const commonOutput = {
  globals: '{rollup_globals}',
  sourcemap: true,
};

export default (args) => {
  return [
    {
      input: join(BASE_PATH, `esm5/${ENTRY_POINT_NAME}.js`),
      output: [
        {
          file: join(BASE_PATH, `fesm5/${ENTRY_POINT_NAME}.js`),
          format: 'es',
          ...commonOutput,
        },
      ],
      external: '{rollup-externals}',
      plugins,
    },
    {
      input: join(BASE_PATH, `${ENTRY_POINT_NAME}.mjs`),
      output: [
        {
          file: join(BASE_PATH, `fesm2015/${ENTRY_POINT_NAME}.js`),
          format: 'es',
          ...commonOutput,
        },
        {
          file: join(BASE_PATH, `bundles/${ENTRY_POINT_NAME}.umd.js`),
          name: ENTRY_POINT_NAME,
          format: 'umd',
          ...commonOutput,
        },
      ],
      external: '{rollup-externals}',
      plugins,
    },
  ];
};
