import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

export default (args) => {
  return {
    plugins: [
      resolve({
        preferBuiltins: true,
        mainFields: ['jsnext', 'module', 'main'],
      }),
      commonjs(),
    ],
  };
};
