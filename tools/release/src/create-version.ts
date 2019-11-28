/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Version } from './parse-version';
import { VersionType } from './publish-branch';

export type ReleaseType = VersionType;

/** Creates a new version that can be used for the given release type. */
export function createNewVersion(
  currentVersion: Version,
  releaseType: ReleaseType,
): Version {
  // Clone the version object in order to keep the
  // original version info un-modified.
  const newVersion = currentVersion.clone();

  // tslint:disable-next-line:prefer-switch
  if (releaseType === 'major') {
    newVersion.major++;
    newVersion.minor = 0;
    newVersion.patch = 0;
  } else if (releaseType === 'minor') {
    newVersion.minor++;
    newVersion.patch = 0;
  } else if (releaseType === 'patch') {
    newVersion.patch++;
  }

  return newVersion;
}
