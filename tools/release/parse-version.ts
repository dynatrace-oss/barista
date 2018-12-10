/** Regular expression that matches version names and the individual version segments. */
const versionNameRegex = /^(\d+)\.(\d+)\.(\d+)?$/;

export class Version {

  constructor(
    /** Major version number */
    public major: number,
    /** Minor version number */
    public minor: number,
    /** Patch version number */
    public patch: number) { }

  /** Serializes the version info into a string formatted version name. */
  format(): string {
    return serializeVersion(this);
  }

  clone(): Version {
    return new Version(this.major, this.minor, this.patch);
  }
}

/**
 * Parses the specified version and returns an object that represents the individual
 * version segments.
 */
export function parseVersionName(version: string): Version | null {
  const matches = version.match(versionNameRegex);
  return matches ? new Version(
    Number(matches[1]),
    Number(matches[2]),
    Number(matches[3])) : null;
}

/** Serializes the specified version into a string. */
export function serializeVersion(newVersion: Version): string {
  const { major, minor, patch } = newVersion;

  return `${major}.${minor}.${patch}`;
}
