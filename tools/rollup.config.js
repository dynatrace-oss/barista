const { join } = require('path');
const { sync } = require('glob');

export default (args) => {
  console.log('HELLO WORLD!');
  // console.log(sync('**/*.?(m)js'))
  // console.log(args);
  // const binPath = resolve('bazel-out/darwin-fastbuild/bin');

  // const entry = join(binPath, 'libs/barista-components/core/index.js');

  console.log(args);

  const base = 'bazel-out/darwin-fastbuild/bin/libs/barista-components/core';

  return {
    input: join(base, 'index.mjs'),
    output: [
      {
        file: join(base, 'fesm2015/index.js'),
        format: 'es',
        sourcemap: true,
      },
      {
        file: join(base, 'fesm5/index.js'),
        format: 'es',
        sourcemap: true,
      },
      {
        file: join(base, 'bundles/index.umd.js'),
        name: 'index',
        format: 'umd',
        sourcemap: true,
      },
    ],
    plugins: [],
  };
};
