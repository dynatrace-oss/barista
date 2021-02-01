/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

const { mkdtempSync } = require('fs');
const { exit } = require('process');
const { tmpdir, EOL } = require('os');
const { sep } = require('path');
const { spawnSync } = require('child_process');
const open = require('open');

const spawnOptions = { stdio: 'pipe', encoding: 'utf-8' };

async function main() {
  const [, outputLine] = spawnSync(
    'bazel',
    ['info', 'output_path'],
    spawnOptions,
  ).output;
  const bazelOutputPath = outputLine.replace(EOL, '');

  const lcovReportPath = `${bazelOutputPath}/_coverage/_coverage_report.dat`;

  // Create a directory in the OS temp folder
  const htmlReportPath = mkdtempSync(tmpdir() + sep);

  const generatorProcess = spawnSync(
    'genhtml',
    [
      '-o',
      htmlReportPath,
      '--ignore-errors',
      'source', // Ignore missing source files since e.g. the tokens are generated
      lcovReportPath,
    ],
    spawnOptions,
  );
  if (generatorProcess.status != 0) {
    throw new Error(
      `Couldn't generate HTML report. Check if 'genhtml' is installed (see DEVELOPMENT.md). ` +
        `Error: ${generatorProcess.stderr}`,
    );
  }

  await open(`${htmlReportPath}/index.html`);
}

main().catch((e) => {
  console.error(e);
  exit(1);
});
