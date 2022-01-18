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
import * as childProcess from 'child_process';
import { vol } from 'memfs';
import { parse } from 'semver';
import { publishPackage, npmPublish, yarnPublish } from './publish-package';
import axios from 'axios';
import { sep } from 'path';
import { cwd } from 'process';
import { platform } from 'os';

const VERSION = parse('5.0.0')!;
let processSpy: jest.SpyInstance;

const root = platform() === 'win32' ? `${cwd().split(sep)[0]}${sep}` : '/';

beforeEach(() => {
  jest.spyOn(process, 'cwd').mockImplementation(() => root);
  vol.reset();
  vol.fromJSON({
    '/components/package.json': JSON.stringify({ version: '5.0.0' }),
  });
  jest.spyOn(axios, 'get').mockImplementation(async () => ({
    data: 'response-text',
  }));
  processSpy = jest
    .spyOn(childProcess, 'exec')
    .mockImplementation((_command: string, _options: any, callback: any) => {
      return callback(null, { stdout: 'ok' });
    });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
});

test('should call the npm and yarn publish commands with the right arguments', async () => {
  await publishPackage(root, '/components', VERSION);

  expect(processSpy).toHaveBeenCalledTimes(2);
  expect(processSpy).toHaveBeenNthCalledWith(
    1,
    'npm publish --access=public',
    { cwd: '/components', maxBuffer: expect.any(Number) },
    expect.any(Function),
  );

  expect(processSpy).toHaveBeenNthCalledWith(
    2,
    'yarn publish --verbose --new-version=5.0.0 /components',
    // cwd should be the root dir
    { cwd: root, maxBuffer: expect.any(Number) },
    expect.any(Function),
  );

  // completely remove the spy
  processSpy.mockRestore();
  processSpy.mockClear();
});

test('should create a .npmrc for the public version', async () => {
  process.env.NPM_PUBLISH_TOKEN = 'my-token';

  await npmPublish('/components');

  expect(vol.toJSON()).toMatchInlineSnapshot(`
    Object {
      "/components/.npmrc": "//registry.npmjs.org/:_authToken=my-token",
      "/components/package.json": "{\\"version\\":\\"5.0.0\\"}",
    }
  `);
});

test('should create a .npmrc for the internal version', async () => {
  process.env.ARTIFACTORY_URL = 'http://my-url/api/';

  await yarnPublish('/components', parse('5.0.0')!, '/');

  expect(vol.toJSON()).toMatchInlineSnapshot(`
    Object {
      "/.npmrc": "@dynatrace:registry=http://my-url/api/api/npm/npm-dynatrace-release-local/
    response-text",
      "/components/package.json": "{\\"version\\":\\"5.0.0\\"}",
    }
  `);
});
