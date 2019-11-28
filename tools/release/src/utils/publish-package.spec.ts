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
import * as childProcess from 'child_process';
import { vol } from 'memfs';
import { parse } from 'semver';
import { publishPackage } from './publish-package';

const VERSION = parse('5.0.0')!;

beforeEach(() => {
  process.chdir('/');
  vol.reset();
  vol.fromJSON({
    '/components/package.json': JSON.stringify({ version: '5.0.0' }),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test('should call the npm and yarn publish commands with the right arguments', async () => {
  let processSpy = jest
    .spyOn(childProcess, 'exec')
    .mockImplementation((_command: string, _options: any, callback: any) => {
      return callback(null, { stdout: 'ok' });
    });

  await publishPackage('/components', VERSION);

  expect(processSpy).toHaveBeenCalledTimes(2);

  expect(processSpy).toHaveBeenNthCalledWith(
    1,
    'npm publish --access=public --tag=5.0.0',
    { cwd: '/components', maxBuffer: expect.any(Number) },
    expect.any(Function),
  );

  expect(processSpy).toHaveBeenNthCalledWith(
    2,
    'yarn publish --verbose --new-version=5.0.0 /components',
    // cwd should be the root dir
    { cwd: '/', maxBuffer: expect.any(Number) },
    expect.any(Function),
  );

  // completely remove the spy
  processSpy.mockRestore();
  processSpy.mockClear();
});
