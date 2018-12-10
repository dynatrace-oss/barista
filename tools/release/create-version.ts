import {Version} from './parse-version';
import {VersionType} from './publish-branch';

export type ReleaseType = VersionType;

/** Creates a new version that can be used for the given release type. */
export function createNewVersion(currentVersion: Version, releaseType: ReleaseType): Version {
  // Clone the version object in order to keep the original version info un-modified.
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
