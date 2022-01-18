/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { tryJsonParse } from '@dynatrace/shared/node';
import { grey } from 'chalk';
import { execSync } from 'child_process';
import { resolve, normalize } from 'path';
import { options } from 'yargs';
import { affectedArgs } from './affected-args';
import {
  getAffectedProjects,
  splitArrayIntoChunks,
  groupByDependencies,
} from './util';

const NX_META = resolve('node_modules/.cache/nx/nxdeps.json');

/**
 * options to pass to the script:
 * --target <the nx workspace target>
 * --configuration <the configuration>
 * --withDeps
 */
export async function runParallel(): Promise<string | null> {
  const { CIRCLE_NODE_INDEX, CIRCLE_NODE_TOTAL } = process.env;
  const currentNode = +(CIRCLE_NODE_INDEX || 0);
  const totalNodes = +(CIRCLE_NODE_TOTAL || 1);

  const {
    args,
    configuration,
    exclude,
    increasedMemory,
    parallel,
    target,
    withDeps,
  } = options({
    target: { type: 'string', alias: 't', demandOption: true },
    configuration: { type: 'string', alias: 'c' },
    exclude: {
      type: 'string',
      alias: 'e',
      description: 'Comma separated list of projects that should be excluded',
    },
    parallel: { type: 'boolean', default: true, alias: 'p' },
    withDeps: { type: 'boolean', alias: 'd' },
    args: {
      type: 'string',
      alias: 'a',
      description:
        'List of additional args that should be passed to the command',
    },
    increasedMemory: {
      type: 'number',
      alias: 'm',
      description: 'Number of MB for the node process',
    },
  }).argv;

  const baseSha = await affectedArgs();
  const blockList = exclude?.split(',') ?? [];
  const projects = getAffectedProjects(baseSha, target).filter(
    (project) => !blockList.includes(project),
  );
  const chunkSize = Math.ceil(projects.length / totalNodes);

  let chunks: string[][];

  if (withDeps) {
    // The nx meta gets generated through the print-affected command
    // that is executed via the `getAffectedProjects`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nxMeta = await tryJsonParse<any>(NX_META);
    const nxDependencies = nxMeta.dependencies;

    const projectsWithDependencies = projects.map((project) => {
      const deps = nxDependencies[project]
        .map((dep) => dep.target)
        .filter((dep) => projects.includes(dep));
      return {
        project,
        deps,
      };
    });
    chunks = groupByDependencies(projectsWithDependencies, chunkSize);
  } else {
    chunks = splitArrayIntoChunks(projects, chunkSize);
  }

  if (!chunks[currentNode] && !Array.isArray(chunks[currentNode])) {
    console.log(
      `---------------------------------------------------------------\n` +
        ` $ ${grey('Nothing to run on Node: ' + currentNode)}\n\n` +
        `---------------------------------------------------------------\n` +
        ``,
    );
    return null;
  }

  const currentChunk = chunks[currentNode].join(',');

  const flags = [
    `--target="${target}"`,
    `--projects="${currentChunk}"`,
    '--skip-nx-cache',
  ];

  if (parallel) {
    flags.push(`--parallel`);
  }

  if (configuration) {
    flags.push(`--configuration="${configuration}"`);
  }

  if (args) {
    flags.push(args);
  }

  const baseCommand = ['node'];

  if (increasedMemory) {
    baseCommand.push(`--max_old_space_size=${increasedMemory}`);
  }

  baseCommand.push(normalize('./node_modules/@nrwl/cli/bin/nx.js run-many'));

  const command = [...baseCommand, ...flags];

  console.log(
    `---------------------------------------------------------------\n` +
      ` $ ${grey(command.join(' / \n\t'))}\n\n` +
      `---------------------------------------------------------------\n` +
      ``,
  );

  return command.join(' ');
}

// if filename is set the file is executed via an import or require.
// This should only run on direct execution with nodejs.
if (!require.main?.filename) {
  runParallel()
    .then((command: string | null) => {
      if (command) {
        execSync(command, { stdio: [0, 1, 2] });
      }
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
