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

import { context, GitHub } from '@actions/github';
/** Add labels to the processed pr */
export async function updateTargetLabels(
  client: GitHub,
  prNumber: number,
  labels: string[],
) {
  const issue = await client.issues.get({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
  });
  // use the original labels without the target ones.
  const originalLabels = issue.data.labels
    .filter((label) => !label.name.startsWith('target'))
    .map((label) => label.name);
  // Join the original labels with the new target labels
  const filteredLabels = [...labels, ...originalLabels];
  // Update the issue labels.
  await client.issues.update({
    owner: context.repo.owner,
    repo: context.repo.repo,
    issue_number: prNumber,
    labels: filteredLabels,
  });
}
