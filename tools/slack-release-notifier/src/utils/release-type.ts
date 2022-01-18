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

import { ReposGetReleaseByTagResponse } from '@octokit/rest';

import { parse } from 'semver';

enum ReleaseType {
  Prerelease,
  Major,
  Minor,
  Patch,
  Unknown,
}

/**
 * Compares the current with the previous release to calculate the release type
 * @param release The current release
 * @param previousRelease The previous release
 * @returns The release type of the current release
 */
export function getReleaseType(
  release: ReposGetReleaseByTagResponse,
): ReleaseType {
  if (release.prerelease) {
    return ReleaseType.Prerelease;
  }

  const version = parse(release.tag_name);
  if (!version) {
    return ReleaseType.Unknown;
  }

  if (version.minor === 0 && version.patch === 0) {
    return ReleaseType.Major;
  } else if (version.patch === 0) {
    return ReleaseType.Minor;
  } else {
    return ReleaseType.Patch;
  }
}

/**
 * Returns a friendly formatted text for the given release type
 * @param releaseType The release type
 * @returns Friendly formatted text for the release type
 */
export function getTextForReleaseType(releaseType: ReleaseType): string {
  switch (releaseType) {
    case ReleaseType.Major:
      return ':confetti_ball: MAJOR RELEASE :party_parrot:';
    case ReleaseType.Minor:
      return ':arrow_up: Minor release';
    case ReleaseType.Patch:
      return ':bug: Fix release';
    case ReleaseType.Prerelease:
      return ':hatching_chick: Pre-release';
    case ReleaseType.Unknown:
      return ':shrug: Other release';
  }
}
