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
import { green, italic } from 'chalk';
import { ReleaseNotes } from '../extract-release-notes';
import { GET_TAG_PUSH_ERROR } from './release-errors';

/**
 * Creates a tag if it does not already exist and checks whether the commit
 * message is a bump version message
 *
 * @throws Will throw if the tag would be created on a non bump message
 */
export async function createReleaseTag(
  tagName: string,
  releaseNotes: ReleaseNotes,
  releaseCommit: string,
  githubApi: Octokit,
): Promise<void> {
  const owner = 'dynatrace-oss';
  const repo = 'barista';

  try {
    await githubApi.git.createTag({
      owner,
      repo,
      message: releaseNotes.releaseNotes,
      tag: tagName,
      type: 'commit',
      object: releaseCommit,
    });

    await githubApi.git.createRef({
      owner,
      repo,
      ref: `refs/tags/${tagName}`,
      sha: releaseCommit,
    });

    await githubApi.repos.createRelease({
      owner,
      repo,
      tag_name: tagName,
      body: releaseNotes.releaseNotes,
      prerelease: tagName.includes('rc'),
    });

    console.log(green(`  ✓   Created release tag: "${italic(tagName)}"`));
  } catch (error) {
    console.log(error);
    throw new Error(GET_TAG_PUSH_ERROR(tagName));
  }
}
