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

import { green, italic } from 'chalk';
import {
  GET_TAG_PUSH_ERROR,
  GET_TAG_ALREADY_EXISTS_ON_REMOTE,
  GET_TAG_ALREADY_EXISTS,
  GET_LOCAL_TAG_EXISTS_BUT_NO_BUMP_ERROR,
} from './utils';
import { GitClient } from './git/git-client';
import { ReleaseNotes } from './extract-release-notes';

/**
 * Creates a tag if it does not already exist and checks whether the commit
 * message is a bump version message
 * @throws Will throw if the tag would be created on a non bump message
 */
export function createReleaseTag(
  tagName: string,
  releaseNotes: ReleaseNotes,
  git: GitClient,
): void {
  if (git.hasLocalTag(tagName)) {
    const expectedSha = git.getLocalCommitSha('HEAD');

    if (git.getShaOfLocalTag(tagName) !== expectedSha) {
      throw new Error(GET_LOCAL_TAG_EXISTS_BUT_NO_BUMP_ERROR(tagName));
    }

    console.log(
      green(`  ✓   Release tag already exists: "${italic(tagName)}"`),
    );
  } else if (git.createTag(tagName, releaseNotes.releaseTitle)) {
    console.log(green(`  ✓   Created release tag: "${italic(tagName)}"`));
  } else {
    throw new Error(GET_TAG_ALREADY_EXISTS(tagName));
  }
}

/** Pushes the release tag to the remote repository. */
export function pushReleaseTag(tagName: string, git: GitClient): void {
  const remoteTagSha = git.getRemoteCommitSha(tagName);
  const expectedSha = git.getLocalCommitSha('HEAD');

  // The remote tag SHA is empty if the tag does not exist in the remote repository.
  if (remoteTagSha) {
    if (remoteTagSha !== expectedSha) {
      throw new Error(GET_TAG_ALREADY_EXISTS_ON_REMOTE(tagName));
    }

    console.log(
      green(`  ✓   Release tag already exists remotely: "${italic(tagName)}"`),
    );
    return;
  }

  if (!git.pushBranchOrTagToRemote(tagName)) {
    throw new Error(GET_TAG_PUSH_ERROR(tagName));
  }

  console.log(green(`  ✓   Pushed release tag upstream.`));
}
