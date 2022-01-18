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

import {
  lstatSync,
  readdirSync,
  mkdirSync,
  existsSync,
  promises as fs,
} from 'fs';
import { join, resolve, relative, dirname } from 'path';
import { bold } from 'chalk';
import { environment } from '@environments/barista-environment';
import { generateShareableExampleProject } from './generate-project';

const shareableExamplesDist = resolve(
  environment.rootDir,
  'dist/libs/tools/shareable-examples/data',
);

/** Collect all files containing examples in the demos app. */
function getExamplesInPackages(): string[] {
  // Read the root of the examples directory, all examples are grouped
  // by their root component.
  return readdirSync(environment.examplesLibDir)
    .map((name) => join(environment.examplesLibDir, name))
    .filter((dir) => lstatSync(dir).isDirectory())
    .map((exampleRoot) => {
      // Read the examples within their root component context
      // to get all.
      return (
        readdirSync(exampleRoot)
          .map((name) => join(exampleRoot, name))
          .filter((dir) => lstatSync(dir).isDirectory())
          // Only include folders that end with 'example'
          .filter((dir) => dir.endsWith('example'))
      );
    })
    .reduce<string[]>((aggregator, examples) => {
      return [...aggregator, ...examples];
    }, []);
}

/**
 * Generates the shareable barista example project code.
 */
async function main(): Promise<void> {
  console.log();
  console.log(bold(`Generating sharable example projects`));
  console.log(`Collecting example and module files and extracting metadata`);

  const allExampleRoots = getExamplesInPackages();

  // Ensure output directory
  if (!existsSync(shareableExamplesDist)) {
    mkdirSync(shareableExamplesDist, { recursive: true });
  }

  // Collect a list of available examples.
  const examplesList: string[] = [];

  // Iterate the examples and isolate the projects.
  for (const example of allExampleRoots) {
    const shareableExampleProject = await generateShareableExampleProject(
      example,
    );
    if (shareableExampleProject) {
      examplesList.push(shareableExampleProject.name);
      for (const exampleFile of shareableExampleProject.files) {
        // Get a relative directory path to the file.
        const relativeDir = relative(
          environment.examplesLibDir,
          exampleFile.path,
        );
        const fileDestinationPath = resolve(
          shareableExamplesDist,
          shareableExampleProject.name,
          'src',
          relativeDir,
        );
        // Check if the directory exists and create it if it is not there.
        if (!existsSync(dirname(fileDestinationPath))) {
          mkdirSync(dirname(fileDestinationPath), { recursive: true });
        }
        // Write the file to the dist directory and into a example name.
        await fs.writeFile(fileDestinationPath, exampleFile.content);
      }
    }
  }

  // Write the metadata for available examples.
  await fs.writeFile(
    resolve(shareableExamplesDist, 'metadata.json'),
    JSON.stringify({ availableExamples: examplesList }, null, 2),
  );

  console.log();
  console.log(bold(`Done generating sharable example projects`));
  console.log(`Generated ${allExampleRoots.length} examples`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
