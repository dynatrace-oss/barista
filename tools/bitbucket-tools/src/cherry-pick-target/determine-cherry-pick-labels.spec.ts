import { splitStringIntoCommitMessage } from '../commit-message-validation/split-message-into-components';
import { determineCherryPickLabelsForMasterTarget } from './determine-cherry-pick-labels';

describe('Determining cherry pick labels', () => {
  test('should add label major if commits contain breaking changes', () => {
    const commits = [
      splitStringIntoCommitMessage(
        'feat(button): Added a button feature BREAKING CHANGE',
      ),
    ];
    expect(determineCherryPickLabelsForMasterTarget(commits)).toStrictEqual([
      'major',
    ]);
  });

  test('should add label minor and target:minor if commits contain features', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
    ];
    expect(determineCherryPickLabelsForMasterTarget(commits)).toStrictEqual([
      'minor',
      'target:minor',
    ]);
  });

  test('should add label patch, target:minor and target:patch if commits contain fix', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button feature'),
    ];
    expect(determineCherryPickLabelsForMasterTarget(commits)).toStrictEqual([
      'patch',
      'target:minor',
      'target:patch',
    ]);
  });

  test('should add label patch, target:minor and target:patch if commits contain perf', () => {
    const commits = [
      splitStringIntoCommitMessage('perf(button): Added a button feature'),
    ];
    expect(determineCherryPickLabelsForMasterTarget(commits)).toStrictEqual([
      'patch',
      'target:minor',
      'target:patch',
    ]);
  });

  test('should add label target:minor and target:patch if commits contain anything but feat, fix or perf', () => {
    const commits = [
      splitStringIntoCommitMessage('chore(button): Added a button feature'),
      splitStringIntoCommitMessage('docs(button): Added a button feature'),
    ];
    expect(determineCherryPickLabelsForMasterTarget(commits)).toStrictEqual([
      'target:minor',
      'target:patch',
    ]);
  });
});
