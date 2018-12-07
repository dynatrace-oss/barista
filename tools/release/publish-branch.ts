import {Version} from './parse-version';

export type VersionType = 'major' | 'minor' | 'patch';

/** Determines the type of the specified Semver version. */
export function getSemverVersionType(version: Version): VersionType {
  if (version.minor === 0 && version.patch === 0) {
    return 'major';
  } else if (version.patch === 0) {
    return 'minor';
  } else {
    return 'patch';
  }
}
