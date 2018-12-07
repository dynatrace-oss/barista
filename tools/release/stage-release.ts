import { join } from 'path';
import { cyan, italic, red, green, bold } from 'chalk';
import { readFileSync, existsSync, writeFileSync } from 'fs';
import { promptForNewVersion } from './new-version-prompt';
import { Version, parseVersionName } from './parse-version';
import { GitClient } from './git-client';
import { promptAndGenerateChangelog } from './changelog';

/** Default filename for the changelog. */
const CHANGELOG_FILE_NAME = 'CHANGELOG.md';

class StageReleaseTask {
  /** Path to the project package JSON. */
  packageJsonPath: string;

  /** Serialized package.json of the specified project. */
  packageJson: any;

  /** Parsed current version of the project. */
  currentVersion: Version;

  /** Instance of a wrapper that can execute Git commands. */
  git: GitClient;

  constructor(public projectDir: string, public repositoryName: string) {
    this.packageJsonPath = join(projectDir, 'package.json');

    if (!existsSync(this.packageJsonPath)) {
      console.error(red(`The specified directory is not referring to a project directory. ` +
        `There must be a ${italic('package.json')} file in the project directory.`));
      process.exit(1);
    }

    this.packageJson = JSON.parse(readFileSync(this.packageJsonPath, 'utf-8'));
    this.currentVersion = parseVersionName(this.packageJson.version);

    this.git = new GitClient(projectDir, `***REMOVED***
  }

  async run() {
    console.log();
    console.log(cyan('-----------------------------------------------------'));
    console.log(cyan('  Dynatrace Angular Components stage release script'));
    console.log(cyan('-----------------------------------------------------'));
    console.log();

    const newVersion = await promptForNewVersion(this.currentVersion);

    console.log();

    // this.verifyPublishBranch('master');
    // this.verifyLocalCommitsMatchUpstream('master');
    // this.verifyNoUncommittedChanges();

    const newVersionName = newVersion.format();

    this.updatePackageJsonVersion(newVersionName);
    console.log(green(`  ✓   Updated the version to "${bold(newVersionName)}" inside of the ${italic('package.json')}`));
    console.log();

    await promptAndGenerateChangelog(join(this.projectDir, CHANGELOG_FILE_NAME), `Version ${newVersionName}`);
  }

  /** Updates the version of the project package.json and writes the changes to disk. */
  private updatePackageJsonVersion(newVersionName: string): void {
    const newPackageJson = { ...this.packageJson, version: newVersionName };
    writeFileSync(this.packageJsonPath, `${JSON.stringify(newPackageJson, null, 2)}\n`);
  }

  /** Verifies that the user is on the specified publish branch. */
  private verifyPublishBranch(expectedPublishBranch: string): void {
    const currentBranchName = this.git.getCurrentBranch();

    // Check if current branch matches the expected publish branch.
    if (expectedPublishBranch !== currentBranchName) {
      console.error(red(
        `  ✘ Cannot stage release from "${italic(currentBranchName)}". Please ` +
        `stage the release from "${bold(expectedPublishBranch)}".`));
      process.exit(1);
    }
  }

  /** Verifies that the local branch is up to date with the given publish branch. */
  private verifyLocalCommitsMatchUpstream(publishBranch: string): void {
    const upstreamCommitSha = this.git.getRemoteCommitSha(publishBranch);
    const localCommitSha = this.git.getLocalCommitSha('HEAD');
    console.log(localCommitSha, upstreamCommitSha);
    // Check if the current branch is in sync with the remote branch.
    if (upstreamCommitSha !== localCommitSha) {
      console.error(red(
        `  ✘ Cannot stage release. The current branch is not in sync with the ` +
        `remote branch. Please make sure your local branch "${italic(publishBranch)}" is up ` +
        `to date.`));
      process.exit(1);
    }
  }

  /** Verifies that there are no uncommitted changes in the project. */
  private verifyNoUncommittedChanges(): void {
    if (this.git.hasUncommittedChanges()) {
      console.error(red(`  ✘ Cannot stage release. There are changes which are not committed and should be stashed.`));
      process.exit(1);
    }
  }
}

/** Entry-point for the release staging script. */
if (require.main === module) {
  new StageReleaseTask(join(__dirname, '../../'), 'angular-components').run();
}
