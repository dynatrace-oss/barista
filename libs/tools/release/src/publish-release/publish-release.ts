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

import { Octokit } from '@octokit/rest';
import { bold, green } from 'chalk';
import { config as dotenvConfig } from 'dotenv';
import { join } from 'path';
import { map, switchMap } from 'rxjs/operators';
import { CHANGELOG_FILE_NAME } from '../changelog';
import { CircleCiApi } from '@dynatrace/shared/node';
import { extractReleaseNotes } from '../extract-release-notes';
import {
  GitClient,
  verifyLocalCommitsMatchUpstream,
  verifyNoUncommittedChanges,
  verifyPassingGithubStatus,
} from '../git';
import { promptConfirmReleasePublish } from '../prompts';
import {
  createFolder,
  NO_TOKEN_PROVIDED_ERROR,
  NO_VALID_RELEASE_BRANCH_ERROR,
  shouldRelease,
  unpackTarFile,
  verifyBundle,
  parsePackageVersion,
  createReleaseTag,
} from '../utils';
import { publishPackage } from '../utils/publish-package';

// load the environment variables from the .env file in your workspace
dotenvConfig();

/**
 * The function to publish a release -
 * requires user interaction/input through command line prompts.
 */
export async function publishRelease(workspaceRoot: string): Promise<void> {
  /** The temporary folder where the dist should be unpacked */
  const TMP_FOLDER = join(workspaceRoot, 'tmp');

  const environmentConfigs = [
    'CIRCLE_CI_TOKEN',
    'NPM_PUBLISH_TOKEN',
    'ARTIFACTORY_URL',
    'NPM_INTERNAL_USER',
    'NPM_INTERNAL_PASSWORD',
  ];

  environmentConfigs.forEach((variableName: string) => {
    if (!process.env[variableName]) {
      throw new Error(NO_TOKEN_PROVIDED_ERROR(variableName));
    }
  });

  console.info();
  console.info(green('-----------------------------------------'));
  console.info(green(bold('  Dynatrace Barista components release script')));
  console.info(green('-----------------------------------------'));
  console.info();

  // The ci api to get the latest build artifacts
  const circleCiApi = new CircleCiApi(process.env.CIRCLE_CI_TOKEN!);

  // Instance of a wrapper that can execute Git commands.
  const gitClient = new GitClient(workspaceRoot);

  // Octokit API instance that can be used to make Github API calls.
  const githubApi = new Octokit({
    auth: process.env.GITHUB_TOKEN,
  });

  // determine version for the check whether we should release from this branch
  const version = await parsePackageVersion(workspaceRoot);

  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  // #
  // #  V E R I F Y
  // #  ---------------
  // #  Verify if you are on the correct branch and there are no un committed changes
  // #
  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

  // verify if we should release
  if (!shouldRelease(gitClient, version)) {
    throw new Error(NO_VALID_RELEASE_BRANCH_ERROR);
  }
  const currentBranch = gitClient.getCurrentBranch();

  // check that the build was successful
  await verifyPassingGithubStatus(gitClient, githubApi, currentBranch);

  // verify un-committed changes
  verifyNoUncommittedChanges(gitClient);

  // verify local commits match upstream
  verifyLocalCommitsMatchUpstream(gitClient, currentBranch);

  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #
  // #
  // #  D O W N L O A D
  // #  ---------------
  // #  Download built components library from our CI to release this version.
  // #
  // # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # # #

  const releaseCommit = gitClient.getLocalCommitSha('HEAD');
  // the location where the builded dist is located
  const artifactsFolder = join(TMP_FOLDER, 'components');
  const artifactTar = `${artifactsFolder}.tar.gz`;

  // create tmp folder to download the artifact and unpack it.
  await createFolder(TMP_FOLDER);

  // download the artifact
  console.log(`Download the artifact: ${artifactTar} –> ${TMP_FOLDER}`);
  await circleCiApi
    .getArtifactUrlForBranch(releaseCommit)
    .pipe(
      map((artifacts) => artifacts[0]),
      switchMap((artifact) =>
        circleCiApi.downloadArtifact(artifact, artifactTar),
      ),
    )
    .toPromise();

  // unpack the downloaded artifact
  console.log('Unpack the downloaded .tar file: ');
  await unpackTarFile(artifactTar, TMP_FOLDER);

  // check release bundle (verify version in package.json)
  await verifyBundle(version, artifactsFolder);

  // extract release notes
  console.log('Extract release notes:');
  const releaseNotes = extractReleaseNotes(CHANGELOG_FILE_NAME, version.raw);

  // create release tag
  await createReleaseTag(version.raw, releaseNotes, releaseCommit, githubApi);

  // safety net - confirm publish again
  if (process.env.USER !== 'jenkins') {
    await promptConfirmReleasePublish();
  }
  // confirm npm publish
  await publishPackage(workspaceRoot, artifactsFolder, version);
}
