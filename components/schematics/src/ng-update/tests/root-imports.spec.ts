/**
 * @license
 * Copyright 2019 Dynatrace LLC
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
import { createTestCaseSetup } from '../../testing';

export const migrationCollection = require.resolve('../../migration.json');

describe('v5 dynatrace angular components imports', () => {
  it('should migrate root imports correctly', async () => {
    const {
      runFixers,
      appTree,
      writeFile,
      removeTempDir,
    } = await createTestCaseSetup('update-5.0.0', migrationCollection, [
      require.resolve('./root-imports-input.fixture'),
    ]);
    const libDistPath = '/node_modules/@dynatrace/angular-components';

    writeFile(
      `${libDistPath}/index.d.ts`,
      `
      export * from './a';
      export * from './b';
      export * from './c';
      export * from './core';
      export * from './types';
    `,
    );

    writeFile(`${libDistPath}/a/index.d.ts`, `export const a = '';`);
    writeFile(`${libDistPath}/b/index.d.ts`, `export const b = '';`);
    writeFile(`${libDistPath}/c/index.d.ts`, `export const c = '';`);
    writeFile(`${libDistPath}/core/index.d.ts`, `export const VERSION = '';`);
    writeFile(
      `${libDistPath}/types/index.d.ts`,
      `
      export declare interface SomeInterface {
        event: any;
      }
    `,
    );

    if (runFixers) {
      await runFixers();
    }

    expect(
      appTree.readContent(
        'projects/lib-testing/src/tests/root-imports-input.ts',
      ),
    ).toMatchSnapshot();

    removeTempDir();
  });
});
