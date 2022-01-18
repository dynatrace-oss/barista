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

import { PackageJson, CircleCiApi } from '@dynatrace/shared/node';
import { Octokit } from '@octokit/rest';
import { OctokitResponse } from '@octokit/types';
import * as childProcess from 'child_process';
import { vol } from 'memfs';
import { of } from 'rxjs';
import { parse } from 'semver';
import { extractReleaseNotes } from '../extract-release-notes';
import * as git from '../git';
import { GitClient } from '../git/git-client';
import { getFixture } from '../testing/get-fixture';
import {
  CHANGELOG_PARSE_ERROR,
  GET_GITHUB_STATUS_FAILED_ERROR,
  GET_INVALID_PACKAGE_JSON_VERSION_ERROR,
  GET_LOCAL_DOES_NOT_MATCH_UPSTREAM,
  NO_TOKEN_PROVIDED_ERROR,
  parsePackageVersion,
} from '../utils';
// used for mocking
import * as shouldRelease from '../utils/should-release';
import * as unpackTarFile from '../utils/unpack-tar';
import * as createFolder from '../utils/create-folder';
import * as createReleaseTag from '../utils/create-release-tag';
import * as verifyGithub from '../git/verify-github-status';
import * as prompts from '../prompts';
import { publishRelease } from './publish-release';
import axios from 'axios';
import { sep } from 'path';
import { cwd } from 'process';
import { platform } from 'os';

const root = platform() === 'win32' ? `${cwd().split(sep)[0]}${sep}` : '/';

beforeEach(() => {
  // Mock console logs away we don't want to bloat the output
  jest.spyOn(console, 'info').mockImplementation();
  jest.spyOn(process, 'cwd').mockImplementation(() => root);
  vol.reset();
});

afterEach(() => {
  jest.clearAllMocks();
});

test('Should throw an error when no package.json is found', async () => {
  expect.assertions(1);
  try {
    await parsePackageVersion(process.cwd());
  } catch (err) {
    expect(err.message).toBe(
      `Error while parsing json file at ${root}package.json`,
    );
  }
});

test('Should throw an error if the package.json contains an invalid version', async () => {
  const packageJson: PackageJson = { version: 'x.x.x' } as PackageJson;
  vol.fromJSON({
    '/package.json': JSON.stringify(packageJson),
  });

  expect.assertions(1);

  try {
    await parsePackageVersion(process.cwd());
  } catch (err) {
    expect(err.message).toBe(
      GET_INVALID_PACKAGE_JSON_VERSION_ERROR(packageJson),
    );
  }
});

test('Should return false if branch is not a valid release branch', async () => {
  jest
    .spyOn(GitClient.prototype, 'getCurrentBranch')
    .mockImplementation(() => 'some-branch');

  jest
    .spyOn(GitClient.prototype, 'getLastCommit')
    .mockImplementation(() => '1234');

  expect(
    shouldRelease.shouldRelease(new GitClient(process.cwd()), parse('4.15.3')!),
  ).toBe(false);
});

test('Should throw an error when the github status is not successful', async () => {
  const localCommitSha = '1234';
  jest
    .spyOn(GitClient.prototype, 'getLocalCommitSha')
    .mockImplementation(() => localCommitSha);

  const errorResponse = {
    data: { state: 'error' },
  } as OctokitResponse<any>;

  const octokitApi = new Octokit();
  jest
    .spyOn(octokitApi.repos, 'getCombinedStatusForRef')
    .mockImplementation(() => Promise.resolve(errorResponse as any));

  expect.assertions(1);

  try {
    await git.verifyPassingGithubStatus(
      new GitClient(process.cwd()),
      octokitApi,
      'branch',
    );
  } catch (err) {
    expect(err.message).toBe(GET_GITHUB_STATUS_FAILED_ERROR(localCommitSha));
  }
});

test('Should throw an error when the local branch does not match the upstream', async () => {
  jest
    .spyOn(GitClient.prototype, 'getRemoteCommitSha')
    .mockImplementation(() => 'xxxx');

  jest
    .spyOn(GitClient.prototype, 'getLocalCommitSha')
    .mockImplementation(() => '1234');

  const localBranch = 'master';

  expect.assertions(1);
  try {
    git.verifyLocalCommitsMatchUpstream(
      new GitClient(process.cwd()),
      localBranch,
    );
  } catch (err) {
    expect(err.message).toBe(GET_LOCAL_DOES_NOT_MATCH_UPSTREAM(localBranch));
  }
});

test('Should throw an error when the changelog could not be parsed for the release notes', async () => {
  vol.fromJSON({
    'CHANGELOG.md': getFixture('CHANGELOG-invalid.md'),
  });
  expect.assertions(1);

  try {
    extractReleaseNotes('CHANGELOG.md', '4.15.1');
  } catch (err) {
    expect(err.message).toBe(CHANGELOG_PARSE_ERROR);
  }
});

test('should throw when no circle ci token is provided', async () => {
  expect.assertions(1);

  try {
    await publishRelease('/');
  } catch (error) {
    expect(error.message).toBe(NO_TOKEN_PROVIDED_ERROR('CIRCLE_CI_TOKEN'));
  }
});

test('should throw when no npm publish token is provide', async () => {
  process.env.CIRCLE_CI_TOKEN = 'my-token';
  expect.assertions(1);

  try {
    await publishRelease('/');
  } catch (error) {
    expect(error.message).toBe(NO_TOKEN_PROVIDED_ERROR('NPM_PUBLISH_TOKEN'));
  }
});

describe('publish release', () => {
  beforeEach(() => {
    process.env.CIRCLE_CI_TOKEN = '87c589ff2b354f46f223c9915583d3ff476776e7';
    process.env.NPM_PUBLISH_TOKEN = 'my-token';
    process.env.ARTIFACTORY_URL = 'http://test.com';
    process.env.NPM_INTERNAL_USER = 'username';
    process.env.NPM_INTERNAL_PASSWORD = 'password';
    process.env.GITHUB_TOKEN = 'github-token';
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('should run the whole publish pipeline successfully', async () => {
    const commitSha = 'dff6e4181d8589592ab5e568872cccb2ddfb5ef3';
    jest.spyOn(shouldRelease, 'shouldRelease').mockReturnValue(true);
    jest.spyOn(verifyGithub, 'verifyPassingGithubStatus').mockImplementation();
    jest.spyOn(verifyGithub, 'verifyNoUncommittedChanges').mockImplementation();
    jest
      .spyOn(verifyGithub, 'verifyLocalCommitsMatchUpstream')
      .mockImplementation();
    jest
      .spyOn(GitClient.prototype, 'getLocalCommitSha')
      .mockReturnValue(commitSha);

    jest.spyOn(createFolder, 'createFolder').mockImplementation();

    jest
      .spyOn(CircleCiApi.prototype, 'getArtifactUrlForBranch')
      .mockReturnValue(
        of([
          {
            path: 'barista-components',
            node_index: 0,
            url: 'https://6560-218540919-gh.circle-artifacts.com/0/barista-components',
          },
        ]),
      );

    jest
      .spyOn(CircleCiApi.prototype, 'downloadArtifact')
      .mockImplementation(() => of());

    jest.spyOn(unpackTarFile, 'unpackTarFile').mockImplementation();
    jest.spyOn(GitClient.prototype, 'hasLocalTag').mockReturnValue(true);
    jest
      .spyOn(createReleaseTag, 'createReleaseTag')
      .mockImplementation(async () => {});
    jest
      .spyOn(prompts, 'promptConfirmReleasePublish')
      .mockImplementation(async () => {});

    jest.spyOn(axios, 'get').mockImplementation(async () => ({
      data: 'response-text',
    }));

    jest
      .spyOn(childProcess, 'exec')
      .mockImplementation((_command: string, _options: any, callback: any) => {
        return callback(null, { stdout: 'ok' });
      });

    vol.fromJSON({
      '/package.json': JSON.stringify({ version: '5.0.0-rc.0' }),
      '/tmp/components/package.json': JSON.stringify({ version: '5.0.0-rc.0' }),
      '/CHANGELOG.md': getFixture('CHANGELOG-release.md'),
    });

    await publishRelease('/');
  });
});
