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

/* eslint-disable jsdoc/check-indentation  */

import { splitStringIntoCommitMessage } from './split-message-into-components';
import { CommitTypes } from '../interfaces/commit-message';

/**
 * Rules for cherrypicking labels for pull requests targeting master
 *
 *                         PR contains
 *                    BREAKING CHANGE COMMITS?
 *                    /               \
 *                  /                  \
 *                Yes                  No
 *               /                      \
 *             /                         \
 * Add label *target:major*          contains *feat* commits
 *                                     /            \
 *                                   /               \
 *                                Yes                No
 *                                /                   \
 *                              /                      \
 *                       Add labels              contains *fix* or *perf* commits
 *                       *target:minor*              /           \
 *                                                 /              \
 *                                              Yes               No
 *                                              /                  \
 *                                            /                     \
 *                                       Add labels                Add labels
 *                                       *target:patch*            *target:minor*
 *                                       *target:minor*            *target:patch*
 *
 */
export function processCommitMessages(commitMessages: string[]): {
  targets: string[];
  errors: string[];
} {
  const targets: string[] = [];
  const errors: string[] = [];
  // Parse the commit messages and split them into their own components.
  const parsedCommitMessages = commitMessages.map((commit) =>
    splitStringIntoCommitMessage(commit),
  );

  // Filter feature commits in the pull request.
  const featureCommits = parsedCommitMessages.filter(
    (commit) => commit.type === CommitTypes.FEAT,
  );
  // Filter fix commits in the pull request.
  const fixCommits = parsedCommitMessages.filter(
    (commit) =>
      commit.type === CommitTypes.FIX || commit.type === CommitTypes.PERF,
  );
  // If there are more than one feature commit, in the pull request
  // push an error.
  if (featureCommits.length > 1) {
    errors.push(
      `There should be no more than one feature commits, within a single pull request, but found ${featureCommits.length}.`,
    );
  }
  // If there are more than one fix commit, in the pull request
  // push an error.
  if (fixCommits.length > 1) {
    errors.push(
      `There should be no more than one fix commits, within a single pull request, but found ${fixCommits.length}.`,
    );
  }

  // If there are fix and feat commits mixed in a pull request,
  // push an error.
  if (featureCommits.length > 0 && fixCommits.length > 0) {
    errors.push(`Feature and fix commits should not be mixed.`);
  }
  // If there are no errors, determine the targets
  if (!errors.length) {
    const hasFeatureCommits = featureCommits.length > 0;
    const hasFixCommits = fixCommits.length > 0;
    const hasBreakingCommits = parsedCommitMessages.some(
      (commit) => commit.breakingChange,
    );
    if (hasBreakingCommits) {
      // The pull request contains breaking changes, it should be
      targets.push('target: major');
    } else if (hasFeatureCommits && !hasFixCommits) {
      targets.push('target: minor');
    } else if (hasFixCommits) {
      targets.push('target: minor', 'target: patch');
    } else if (!hasBreakingCommits && !hasFeatureCommits && !hasFixCommits) {
      targets.push('target: minor', 'target: patch');
    }
  }
  return {
    targets,
    errors,
  };
}
