import { readFileSync } from 'fs-extra';

import { createTestCaseSetup } from '../../utils';

export const migrationCollection = require.resolve('../../migration.json');

describe('v5 dynatrace angular components imports', () => {
  it('should migrate root imports correctly', async () => {
    const {
      runFixers,
      appTree,
      writeFile,
      removeTempDir,
    } = await createTestCaseSetup('migration-v5', migrationCollection, [
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
    ).toBe(
      readFileSync(
        require.resolve('./root-imports-expected-output.fixture'),
        'utf8',
      ),
    );

    removeTempDir();
  });
});
