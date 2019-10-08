import { parseVersionName } from '../../../release/parse-version';

/** Get the minor branch to a corresponding version */
export function getMinorBranchForVersion(
  versionString: string,
): string | undefined {
  const version = parseVersionName(versionString);
  if (version) {
    return `${version.major}.x`;
  }
}
/** Get the patch branch to a corresponding version */
export function getPatchBranchForVersion(
  versionString: string,
): string | undefined {
  const version = parseVersionName(versionString);
  if (version) {
    return `${version.major}.${version.minor}.x`;
  }
}
