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

import { basename, extname } from 'path';

import { getSystemPath, normalize } from '@angular-devkit/core';
import { TempScopedNodeJsSyncHost } from '@angular-devkit/core/node/testing';
import * as virtualFs from '@angular-devkit/core/src/virtual-fs/host';
import { HostTree, Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { readFileSync, rmdirSync } from 'fs';

/** Create a base app used for testing. */
export async function createTestApp(
  runner: SchematicTestRunner,
  appOptions: { name?: string } = {},
  tree?: Tree,
): Promise<UnitTestTree> {
  const workspaceTree = await runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      {
        name: 'workspace',
        version: '6.0.0',
        newProjectRoot: 'projects',
      },
      tree,
    )
    .toPromise();

  return runner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      { name: 'dynatrace/angular-components', ...appOptions },
      workspaceTree,
    )
    .toPromise();
}

/**
 * Creates a test app schematic tree that will be copied over to a real filesystem location.
 * This is necessary because otherwise the TypeScript compiler API would not be able to
 * find source files within the tsconfig project.
 * TODO(devversion): we should be able to make the TypeScript config parsing respect the
 * schematic tree. This would allow us to fully take advantage of the virtual file system.
 */
export async function createFileSystemTestApp(
  runner: SchematicTestRunner,
): Promise<TestCaseSetup> {
  const tempFileSystemHost = new TempScopedNodeJsSyncHost();
  // Needs to be typecast as the @angular/devkit/core has a locked
  // version of rxjs dependency which mismatches with our installed one.
  const hostTree = new HostTree(tempFileSystemHost as any);
  const appTree: UnitTestTree = await createTestApp(
    runner,
    { name: 'lib-testing' },
    hostTree,
  );
  const tempPath = getSystemPath(tempFileSystemHost.root);

  // Since the TypeScript compiler API expects all files to be present on the real file system, we
  // map every file in the app tree to a temporary location on the file system.
  appTree.files.forEach((f) => {
    writeFile(f, appTree.readContent(f));
  });

  return {
    appTree,
    tempFileSystemHost,
    tempPath,
    writeFile,
    removeTempDir: () => {
      rmdirSync(tempPath, { recursive: true });
    },
  };

  function writeFile(filePath: string, content: string): void {
    tempFileSystemHost.sync.write(
      normalize(filePath),
      virtualFs.stringToFileBuffer(content),
    );
  }
}

interface TestCaseSetup {
  appTree: UnitTestTree;
  runFixers?: () => Promise<{
    logOutput: string;
  }>;
  tempPath: string;
  removeTempDir(): void;
  writeFile(filePath: string, content: string): void;
  tempFileSystemHost?: TempScopedNodeJsSyncHost;
}
export async function createTestCaseSetup(
  migrationName: string,
  collectionPath: string,
  inputFiles: string[],
): Promise<TestCaseSetup> {
  const runner = new SchematicTestRunner('schematics', collectionPath);
  const initialWorkingDir = process.cwd();

  let logOutput = '';
  runner.logger.subscribe((entry) => (logOutput += `${entry.message}\n`));

  const { appTree, tempPath, writeFile, removeTempDir } =
    await createFileSystemTestApp(runner);

  _patchTypeScriptDefaultLib(appTree);

  // Write each test-case input to the file-system. This is necessary because otherwise
  // TypeScript compiler API won't be able to pick up the test cases.
  inputFiles.forEach((inputFilePath) => {
    const inputTestName = basename(inputFilePath, extname(inputFilePath));
    const relativePath = `projects/lib-testing/src/tests/${inputTestName}.ts`;
    const inputContent = readFileSync(inputFilePath, 'utf8');

    writeFile(relativePath, inputContent);
  });

  const testAppTsconfigPath = 'projects/lib-testing/tsconfig.app.json';
  const testAppTsconfig = JSON.parse(
    appTree.readContent(testAppTsconfigPath),
  ) as any;

  // include all TypeScript files in the project. Otherwise all test input
  // files won't be part of the program and cannot be migrated.
  testAppTsconfig.include.push('src/**/*.ts');

  writeFile(testAppTsconfigPath, JSON.stringify(testAppTsconfig, null, 2));

  const runFixers = async function (): Promise<{ logOutput: string }> {
    // Switch to the new temporary directory to simulate that "ng update" is ran
    // from within the project.
    process.chdir(tempPath);

    await runner.runSchematicAsync(migrationName, {}, appTree).toPromise();

    // Switch back to the initial working directory.
    process.chdir(initialWorkingDir);

    return { logOutput };
  };

  return { appTree, writeFile, tempPath, removeTempDir, runFixers };
}

/**
 * Patches the specified virtual file system tree to be able to read the TypeScript
 * default library typings. These need to be readable in unit tests because otherwise
 * type checking within migration rules is not working as in real applications.
 */
export function _patchTypeScriptDefaultLib(tree: Tree): void {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const _originalRead = tree.read;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tree.read = function (filePath: string): Buffer | any {
    // In case a file within the TypeScript package is requested, we read the file from
    // the real file system. This is necessary because within unit tests, the "typeScript"
    // package from within the Bazel "@npm" repository  is used. The virtual tree can't be
    // used because the "@npm" repository directory is not part of the virtual file system.
    if (filePath.match(/node_modules[/\\]typescript/)) {
      return readFileSync(filePath);
    } else {
      // eslint-disable-next-line prefer-rest-params
      return _originalRead.apply(this, arguments);
    }
  };
}
