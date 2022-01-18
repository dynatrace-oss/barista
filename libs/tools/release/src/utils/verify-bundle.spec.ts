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

import { vol } from 'memfs';
import { parse, SemVer } from 'semver';
import { BUNDLE_VERSION_ERROR } from './release-errors';
import { verifyBundle } from './verify-bundle';

beforeEach(() => {
  vol.reset();
});

test('should throw an error if the version is lower than the provided', async () => {
  vol.fromJSON({
    '/package.json': JSON.stringify({ version: '5.0.0' }),
  });

  expect.assertions(1);

  try {
    await verifyBundle(parse('4.16.0') as SemVer, '/');
  } catch (error) {
    expect(error.message).toEqual(BUNDLE_VERSION_ERROR);
  }
});

test('should throw an error if the version is greater than the provided', async () => {
  vol.fromJSON({
    '/package.json': JSON.stringify({ version: '5.0.0' }),
  });

  expect.assertions(1);

  try {
    await verifyBundle(parse('5.21.3') as SemVer, '/');
  } catch (error) {
    expect(error.message).toEqual(BUNDLE_VERSION_ERROR);
  }
});

test('should throw an error if the version is an rc one', async () => {
  vol.fromJSON({
    '/package.json': JSON.stringify({ version: '5.0.0' }),
  });

  expect.assertions(1);

  try {
    await verifyBundle(parse('5.0.0-rc.0') as SemVer, '/');
  } catch (error) {
    expect(error.message).toEqual(BUNDLE_VERSION_ERROR);
  }
});

test('should not throw an error if the version matches', async () => {
  vol.fromJSON({
    '/package.json': JSON.stringify({ version: '5.0.0' }),
  });

  await verifyBundle(parse('5.0.0') as SemVer, '/');
});
