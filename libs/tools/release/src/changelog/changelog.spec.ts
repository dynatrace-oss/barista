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
jest.mock('conventional-changelog');

import { promises as fs } from 'fs';
import { vol } from 'memfs';
import { getFixture } from '../testing/get-fixture';
import { prependChangelogFromLatestTag } from './changelog';
import * as changelog from './get-new-changelog';

const newChangelogContent = `
## features

new content
`;

beforeEach(() => {
  vol.reset();
  vol.fromJSON({
    '/CHANGELOG.md': getFixture('CHANGELOG-minimal.md'),
    '/header.hbs': '',
  });
});

test('should prepend the changelog if there is an existing one', async () => {
  jest
    .spyOn(changelog, 'getNewChangelog')
    .mockImplementation(() => Promise.resolve(newChangelogContent));

  await prependChangelogFromLatestTag('/CHANGELOG.md', '/header.hbs');

  const updatedChangelog = await fs.readFile('/CHANGELOG.md', {
    encoding: 'utf-8',
  });
  expect(updatedChangelog).toMatchSnapshot();
});
