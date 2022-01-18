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

export const GITHUB_REPO_OWNER = 'dynatrace-oss';
export const GITHUB_REPO_NAME = 'barista';
export const GITHUB_URL = `https://github.com/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}.git`;

/** Gets a Github URL that refers to a lists of recent commits within a specified branch. */
export function getGithubBranchCommitsUrl(
  owner: string,
  repository: string,
  branchName: string,
): string {
  return `https://github.com/${owner}/${repository}/commits/${branchName}`;
}

/** Gets a Github URL that can be used to create a new release from a given tag. */
export function getGithubNewReleaseUrl(options: {
  owner: string;
  repository: string;
  tagName: string;
  releaseTitle: string;
  body: string;
}): string {
  return (
    `https://github.com/${options.owner}/${options.repository}/releases/new?` +
    `tag=${encodeURIComponent(options.tagName)}&` +
    `title=${encodeURIComponent(options.releaseTitle)}&` +
    `body=${encodeURIComponent(options.body)}`
  );
}
