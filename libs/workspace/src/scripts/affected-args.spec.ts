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
  affectedArgs,
  isMasterOrReleaseBranch,
  NO_CIRCLE_TOKEN_PROVIDED_ERROR,
} from './affected-args';
import fetch from 'node-fetch';
import { CircleCiApi } from '@dynatrace/shared/node';
import { of } from 'rxjs';

// mock node fetch because octokit is using node-fetch under the hood
// cannot mock octokit directly due to their wired module resolution.
jest.mock('node-fetch');

afterEach(() => {
  jest.clearAllMocks();
});

it('should test the regex for identifying a release branch', () => {
  expect(isMasterOrReleaseBranch('master')).toBe(true);
  expect(isMasterOrReleaseBranch('6.x')).toBe(true);
  expect(isMasterOrReleaseBranch('17.8.x')).toBe(true);
  expect(isMasterOrReleaseBranch('a14.x')).toBe(false);
  expect(isMasterOrReleaseBranch('other-master')).toBe(false);
  expect(isMasterOrReleaseBranch('release/6.3.x')).toBe(false);
});

it('should call the github API for pull requests and get the base sha from the api', async () => {
  setEnvironment({ branch: 'test', pr: 895 });
  const fetchSpy = fetch.mockImplementation(async () =>
    mockFetch(mockPrResponse('my-sha-string')),
  );

  expect(await affectedArgs()).toBe('my-sha-string');

  expect(fetchSpy).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/895$/),
    expect.any(Object),
  );
});

it('should call the github API for forked pull requests', async () => {
  setEnvironment({ pr: 892, branch: 'pull/892' });
  const fetchSpy = fetch.mockImplementation(async () =>
    mockFetch(mockPrResponse('base-sha')),
  );

  expect(await affectedArgs()).toBe('base-sha');

  expect(fetchSpy).toHaveBeenNthCalledWith(
    1,
    expect.stringMatching(/892$/),
    expect.any(Object),
  );
});

it('should throw an error if the circle token is not set', async () => {
  setEnvironment({ branch: 'test' });

  try {
    await affectedArgs();
  } catch (error) {
    expect(error.message).toBe(NO_CIRCLE_TOKEN_PROVIDED_ERROR);
  }

  expect.assertions(1);
});

it('should default to origin/master if it is a normal branch without PR', async () => {
  setEnvironment({ branch: 'my-normal-branch', token: 'circle-token' });

  const fetchSpy = fetch.mockImplementation(async () => mockFetch({}));

  expect(await affectedArgs()).toBe('origin/master');
  expect(fetchSpy).not.toHaveBeenCalled();
});

it('should get the last successful run from the CircleCi api for the master branch', async () => {
  setEnvironment({ branch: 'master', token: 'circle-token' });

  const circleSpy = jest
    .spyOn(CircleCiApi.prototype, 'getCommitShaOfLastSuccessfulRun')
    .mockReturnValue(of('my-sha'));

  expect(await affectedArgs()).toBe('my-sha');
  expect(circleSpy).toHaveBeenNthCalledWith(1, 'master');
});

it('should get the last successful run from the CircleCi api for a release branch', async () => {
  setEnvironment({ branch: '6.x', token: 'circle-token' });

  const circleSpy = jest
    .spyOn(CircleCiApi.prototype, 'getCommitShaOfLastSuccessfulRun')
    .mockReturnValue(of('6-x-sha'));

  expect(await affectedArgs()).toBe('6-x-sha');
  expect(circleSpy).toHaveBeenNthCalledWith(1, '6.x');
});

/** mock the node-fetch response */
const mockFetch = <T extends object>(content: T, status = 200) => ({
  ok: true,
  status,
  headers: new Map([['content-type', 'application/json']]),
  json: () => ({ ...content }),
});

/** mock the response of the github PR request */
const mockPrResponse = (sha: string) => ({
  base: {
    label: 'dynatrace-oss:master',
    ref: 'master',
    sha,
  },
});

/** Resets and sets the environment variables that are used by the script */
function setEnvironment(options?: {
  branch?: string;
  pr?: number;
  token?: string;
}): void {
  const pullRequest = options?.pr
    ? `https://github.com/dynatrace-oss/barista/pull/${options.pr}`
    : undefined;

  setProcessEnvProperty('GITHUB_TOKEN');
  setProcessEnvProperty('CIRCLE_API_TOKEN', options?.token);
  setProcessEnvProperty('CIRCLE_BRANCH', options?.branch);
  setProcessEnvProperty('CIRCLE_PROJECT_USERNAME', 'dynatrace-oss');
  setProcessEnvProperty('CIRCLE_PROJECT_REPONAME', 'barista');
  setProcessEnvProperty('CIRCLE_PULL_REQUEST', pullRequest);
}

/** Sets or removes a process.env property */
function setProcessEnvProperty(key: string, value?: string): void {
  if (value) {
    process.env[key] = value;
    return;
  }
  // cannot set property to undefined would result in setting a string
  delete process.env[key];
}
