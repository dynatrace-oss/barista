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
import { createTestCaseSetup } from '../../testing';

export const migrationCollection = require.resolve('../../migration.json');

describe('Migrate all legacy imports from the icon pack and the angular components', () => {
  it('Should migrate all legacy imports from the icon pack and the angular components', async () => {
    const {
      runFixers,
      appTree,
      removeTempDir,
    } = await createTestCaseSetup('update-5.0.0', migrationCollection, [
      require.resolve('./legacy-imports.fixture'),
    ]);

    if (runFixers) {
      await runFixers();
    }

    expect(
      appTree.readContent('projects/lib-testing/src/tests/legacy-imports.ts'),
    ).toMatchSnapshot();

    removeTempDir();
  });
});
