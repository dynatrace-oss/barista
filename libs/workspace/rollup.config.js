import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';

export default {
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
