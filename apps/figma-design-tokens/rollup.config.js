import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import replace from '@rollup/plugin-replace';

import { config as dotenvConfig } from 'dotenv';
import { env } from 'process';

dotenvConfig();

export default {
  plugins: [
    resolve({
      jsnext: true,
      preferBuiltins: true,
      browser: true,
    }),
    json(),
    commonjs(),
    replace({
      'ENV.JSON_BIN_SECRET_KEY': env.JSON_BIN_SECRET_KEY,
    }),
  ],
};
