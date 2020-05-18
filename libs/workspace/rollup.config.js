import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

// ENTRY bundles
const ENTRIES = [
  'src/scripts/affected-args.ts',
  'src/scripts/run-parallel.ts',
  'src/builders/barista-build/builder.ts',
  'src/builders/barista-build/renderer.ts',
  'src/builders/typescript/index.ts',
  'src/builders/packager/index.ts',
  'src/builders/stylelint/index.ts',
  'src/builders/design-tokens/build/index.ts',
  'src/builders/design-tokens/package/index.ts',
  'src/builders/elements/index.ts',
  'src/index.ts',
];

export default (commandLineArgs) => {
  console.log(commandLineArgs);

  const externals = commandLineArgs.e;
  // base rollup options
  const options = {
    treeshake: {
      // DANGERZONE: Please be very carefully with that!
      // AST files have side-effects and would be bundled into.
      moduleSideEffects: false,
    },
    plugins: [
      json(),
      resolve({
        preferBuiltins: true,
      }),
    ],
  };

  return ENTRIES.map((input) => ({
    ...options,
    input,
    output: {
      format: 'cjs',
    },
  }));

  return [
    {
      ...options,
    },
  ];
};
