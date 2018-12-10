import { ChoiceType, prompt } from 'inquirer';
import { Version, parseVersionName } from './parse-version';
import { createNewVersion, ReleaseType } from './create-version';
import preset from './conventional-changelog-preset';

// These imports lack type definitions.
// tslint:disable:no-var-requires no-require-imports
const conventionalRecommendedBump = require(`conventional-recommended-bump`);
// tslint:enable:no-var-requires no-require-imports

/** Answers that will be prompted for. */
interface VersionPromptAnswers {
  proposedVersion: string;
}

/**
 * Prompts the current user-input interface for a new version name. The new version will be
 * validated to be a proper increment of the specified current version.
 */
export async function promptForNewVersion(currentVersion: Version): Promise<Version> {
  const recommendedBump = await recommendBump(currentVersion);
  const recommendVersion = createNewVersion(currentVersion, recommendedBump.releaseType);

  console.log(recommendedBump.reason);
  console.log(`Proposed Version based on commits: ${recommendVersion.format()}`);
  console.log();

  const versionChoices: Array<{ value: string; name: string; releaseType: ReleaseType }> = [
    createVersionChoice(currentVersion, 'major', 'Major release'),
    createVersionChoice(currentVersion, 'minor', 'Minor release'),
    createVersionChoice(currentVersion, 'patch', 'Patch release'),
  ];

  const answers = await prompt<VersionPromptAnswers>([{
    type: 'list',
    name: 'proposedVersion',
    message: `What's the type of the new release?`,
    choices: versionChoices,
    default: versionChoices.findIndex((choice) => choice.releaseType === recommendedBump.releaseType),
  }]);

  return parseVersionName(answers.proposedVersion);
}

/** Creates a new choice for selecting a version inside of an Inquirer list prompt. */
function createVersionChoice(currentVersion: Version, releaseType: ReleaseType, message: string, recommended = false):
  { value: string; name: string; releaseType: ReleaseType } {
  const versionName = createNewVersion(currentVersion, releaseType).format();
  return {
    value: versionName,
    name: `${message} (${versionName})${recommended ? ' [recommended]' : ''}`,
    releaseType,
  };
}

/** Returns an object containing information for the recommended version bump. */
async function recommendBump(currentVersion: Version): Promise<{ level: number; reason: string; releaseType: ReleaseType}> {
  return new Promise<any>((resolve, reject) => {
    conventionalRecommendedBump({ config: preset }, (error, recommendation) => {
      if (error) {
        reject(error);
      } else {
        resolve(recommendation);
      }
    });
  });
}
