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
import axios from 'axios';
import { startServer } from './start-server';
import { join } from 'path';

let forkPid: number;
let forkSpy: jest.SpyInstance<any>;

const fakeServerPath = join(__dirname, '../fixtures/mock-server.js');

beforeEach(() => {
  forkSpy = jest.spyOn(childProcess, 'fork');
});

afterEach(() => {
  forkSpy.mockClear();
  jest.clearAllMocks();
});

it('can start the server in a new fork', async () => {
  try {
    forkPid = (await startServer(fakeServerPath, 3333)).pid;

    const { data } = await axios.get('http://localhost:3333');
    expect(data).toMatch(`<html></html>`);
  } finally {
    expect(typeof forkPid).toBe('number');
    process.kill(forkPid);
  }

  expect(forkSpy).toHaveBeenNthCalledWith(1, fakeServerPath, [], {
    env: { PORT: '3333' },
    silent: true,
  });
});

it('should capture an internal server error on route failure', async () => {
  try {
    forkPid = (await startServer(fakeServerPath, 3333)).pid;
    await axios.get('http://localhost:3333/error');
  } catch (error) {
    expect(error.message).toBe('Request failed with status code 500');
  } finally {
    expect(typeof forkPid).toBe('number');
    process.kill(forkPid);
  }
  expect(forkSpy).toHaveBeenNthCalledWith(1, fakeServerPath, [], {
    env: { PORT: '3333' },
    silent: true,
  });
  // check if the catch tree was run
  expect.assertions(3);
});

// Skip this test on windows, as it is flaky
// TODO: Figure out on how to test this properly in the future.
(process.platform === 'win32' ? it.skip : it)(
  'should capture a child process crash',
  async () => {
    try {
      forkPid = (
        await startServer(fakeServerPath, 3333, {
          FAKE_ERROR: 'true',
        })
      ).pid;
    } catch (error) {
      forkPid = error.pid;
      expect(error.error).toMatch(/Error: FAKED ERROR/);
    } finally {
      expect(typeof forkPid).toBe('number');
      process.kill(forkPid);
    }

    expect(forkSpy).toHaveBeenNthCalledWith(1, fakeServerPath, [], {
      env: { FAKE_ERROR: 'true', PORT: '3333' },
      silent: true,
    });
    // check if the catch tree was run
    expect.assertions(3);
  },
);
