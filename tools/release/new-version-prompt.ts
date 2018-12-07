import { ChoiceType, prompt } from 'inquirer';
import { Version, parseVersionName } from './parse-version';
import { createNewVersion, ReleaseType } from './create-version';

/** Answers that will be prompted for. */
interface VersionPromptAnswers {
  proposedVersion: string;
}

/**
 * Prompts the current user-input interface for a new version name. The new version will be
 * validated to be a proper increment of the specified current version.
 */
export async function promptForNewVersion(currentVersion: Version): Promise<Version> {
  const versionChoices: ChoiceType[] = [
    createVersionChoice(currentVersion, 'major', 'Major release'),
    createVersionChoice(currentVersion, 'minor', 'Minor release'),
    createVersionChoice(currentVersion, 'patch', 'Patch release'),
  ];

  const answers = await prompt<VersionPromptAnswers>([{
    type: 'list',
    name: 'proposedVersion',
    message: `What's the type of the new release?`,
    choices: versionChoices,
  }]);

  return parseVersionName(answers.proposedVersion)!;
}

/** Creates a new choice for selecting a version inside of an Inquirer list prompt. */
function createVersionChoice(currentVersion: Version, releaseType: ReleaseType, message: string): { value: string; name: string } {
  const versionName = createNewVersion(currentVersion, releaseType).format();

  return {
    value: versionName,
    name: `${message} (${versionName})`,
  };
}
