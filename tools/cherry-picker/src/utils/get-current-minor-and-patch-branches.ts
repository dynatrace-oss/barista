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

import { readFileSync } from 'fs';
/**
 * Get the current minor and patch branches
 */
export async function getCurrentMinorAndPatchBranches(): Promise<{
  currentMinorBranch: string;
  currentPatchBranch: string;
}> {
  const packageString = readFileSync(
    '/github/workspace/package.json',
  ).toString();
  const packageJson = JSON.parse(packageString) as any;
  const version = packageJson.version;

  const [major, minor] = version.split('.');

  const currentMinorBranch = `${major}.x`;
  const currentPatchBranch = `${major}.${minor}.x`;
  return {
    currentMinorBranch,
    currentPatchBranch,
  };
}
