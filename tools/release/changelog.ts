import { prompt } from 'inquirer';
import { Readable } from 'stream';
import { readFileSync, createReadStream, createWriteStream } from 'fs';
import { grey } from 'chalk';
import changelogConfig from './conventional-changelog-preset';

// These imports lack type definitions.
// tslint:disable:no-var-requires no-require-imports
const conventionalChangelog = require('conventional-changelog');
const merge2 = require('merge2');
// tslint:enable:no-var-requires no-require-imports

/** Prompts for a changelog release name and prepends the new changelog. */
export async function promptAndGenerateChangelog(changelogPath: string, releaseName: string): Promise<any> {
  await prependChangelogFromLatestTag(changelogPath, releaseName);
}

/**
 * Writes the changelog from the latest Semver tag to the current HEAD.
 * @param changelogPath Path to the changelog file.
 * @param releaseName Name of the release that should show up in the changelog.
 */
export async function prependChangelogFromLatestTag(changelogPath: string, releaseName: string): Promise<any> {
  const outputStream: Readable = conventionalChangelog(
    { changelogConfig }, // core options
    { title: releaseName }, // context options
    null, // raw-commits options
    null, // commit parser options
    createDedupeWriterOptions(changelogPath)); // writer options

  // Stream for reading the existing changelog. This is necessary because we want to
  // actually prepend the new changelog to the existing one.
  const previousChangelogStream = createReadStream(changelogPath);

  return new Promise<any>((resolve, reject) => {
    // Sequentially merge the changelog output and the previous changelog stream, so that
    // the new changelog section comes before the existing versions. Afterwards, pipe into the
    // changelog file, so that the changes are reflected on file system.
    const mergedCompleteChangelog = merge2(outputStream, previousChangelogStream);

    // Wait for the previous changelog to be completely read because otherwise we would
    // read and write from the same source which causes the content to be thrown off.
    previousChangelogStream.on('end', () => {
      mergedCompleteChangelog.pipe(createWriteStream(changelogPath))
        .once('error', (error: any) => { reject(error); })
        .once('finish', () => { resolve(); });
    });

  });
}

/**
 * Creates changelog writer options which ensure that commits are not showing up multiple times.
 * Commits can show up multiple times if a changelog has been generated on a publish branch
 * and has been cherry-picked into "master". In that case, the changelog will already contain
 * commits from master which might be added to the changelog again. This is because usually
 * patch and minor releases are tagged from the publish branches and therefore
 * conventional-changelog tries to build the changelog from last major version to master's HEAD.
 */
function createDedupeWriterOptions(changelogPath: string) {
  const existingChangelogContent = readFileSync(changelogPath, 'utf8');

  return {
    // Specify a writer option that can be used to modify the content of a new changelog section.
    // See: conventional-changelog/tree/master/packages/conventional-changelog-writer
    finalizeContext: (context: any) => {
      context.commitGroups.forEach((group: any) => {
        group.commits = group.commits.filter((commit: any) => {
          // NOTE: We cannot compare the SHA's because the commits will have a different SHA
          // if they are being cherry-picked into a different branch.
          if (existingChangelogContent.includes(commit.header)) {
            console.log(grey(`Excluding: "${commit.header}" (${commit.hash})`));
            return false;
          }
          return true;
        });
      });
      return context;
    }
  };
}
