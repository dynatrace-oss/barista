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
import { lint, LinterResult } from 'stylelint';
import { junitFormatter, createXML } from './junit-formatter';
import { writeFileSync } from 'fs';
import { resolve, relative } from 'path';
import { options } from 'yargs';

const { XML_OUTPUT_FILE } = process.env;

if (!XML_OUTPUT_FILE) {
  throw new Error('Bazel environment variables are not set!');
}

const { files, allowEmpty, config } = options({
  files: { type: 'array', default: [] },
  config: { type: 'string', demandOption: true },
  allowEmpty: { type: 'boolean', default: false },
}).argv;

/** Main function that executes the linting */
async function main(): Promise<void> {
  let lintingOutcome: LinterResult;
  if (files.length === 0 && allowEmpty) {
    lintingOutcome = {
      errored: false,
      results: [],
      output: createXML([]),
    };
  } else {
    lintingOutcome = await lint({
      configFile: resolve(config),
      files: files.map((f) => resolve(f)),
      disableDefaultIgnores: true,
      formatter: junitFormatter,
    });
  }

  writeFileSync(XML_OUTPUT_FILE as string, lintingOutcome.output);

  const lintResult = lintingOutcome.results.map((suite) => {
    const file = relative(process.cwd(), suite.source);
    const warnings = suite.warnings.map((c) => `L${c.line}: ${c.text}`);
    const icon = suite.errored ? '\u2705' : '\u274C';

    return `
${icon} ${file} ${warnings.length ? '\n\n' + warnings.join('\n') : ''}`;
  });

  if (lintingOutcome.errored) {
    throw new Error(`Lint errors found in the listed files:

${lintResult}
`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
