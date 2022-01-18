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
import { Octokit } from '@octokit/rest';
import { createReleaseTag } from './create-release-tag';
import { ReleaseNotes } from '../extract-release-notes';

const releaseNotes: ReleaseNotes = {
  releaseTitle: '',
  releaseNotes: 'notes',
};
let githubApi: Octokit;
let createTagSpy: jest.SpyInstance;
let createRefSpy: jest.SpyInstance;
let createReleaseSpy: jest.SpyInstance;

beforeEach(() => {
  githubApi = new Octokit();

  createTagSpy = jest.spyOn(githubApi.git, 'createTag').mockImplementation();
  createRefSpy = jest.spyOn(githubApi.git, 'createRef').mockImplementation();
  createReleaseSpy = jest
    .spyOn(githubApi.repos, 'createRelease')
    .mockImplementation();
});

test('should call create tag with the following attributes', async () => {
  await createReleaseTag('5.0.0', releaseNotes, 'commitsha', githubApi);

  expect(createTagSpy).toHaveBeenCalledWith({
    message: 'notes',
    object: 'commitsha',
    owner: 'dynatrace-oss',
    repo: 'barista',
    tag: '5.0.0',
    type: 'commit',
  });
});

test('should call create ref with the following attributes', async () => {
  await createReleaseTag('5.0.0', releaseNotes, 'commitsha', githubApi);

  expect(createRefSpy).toHaveBeenCalledWith({
    owner: 'dynatrace-oss',
    ref: 'refs/tags/5.0.0',
    repo: 'barista',
    sha: 'commitsha',
  });
});

test('should call the create release endpoint with the following attributes', async () => {
  await createReleaseTag('5.0.0', releaseNotes, 'commitsha', githubApi);

  expect(createReleaseSpy).toHaveBeenCalledWith({
    body: 'notes',
    owner: 'dynatrace-oss',
    prerelease: false,
    repo: 'barista',
    tag_name: '5.0.0',
  });
});

test('should call the create release endpoint with with a prerelease', async () => {
  await createReleaseTag('5.0.0-rc.0', releaseNotes, 'commitsha', githubApi);

  expect(createReleaseSpy).toHaveBeenCalledWith({
    body: 'notes',
    owner: 'dynatrace-oss',
    prerelease: true,
    repo: 'barista',
    tag_name: '5.0.0-rc.0',
  });
});
