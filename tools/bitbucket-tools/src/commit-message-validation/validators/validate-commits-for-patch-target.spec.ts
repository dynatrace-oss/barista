import { splitStringIntoCommitMessage } from '../split-message-into-components';
import { PrError } from '../validate-commits-in-pull-request';
import { validateCommitsForPatchTarget } from './validate-commits-for-patch-target';

describe('if target branch is patch, only fix and perf are allowed', () => {
  test('should pass if there is a fix commit against a patch branch', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
      splitStringIntoCommitMessage('fix(card): Added a card fix'),
    ];
    expect(validateCommitsForPatchTarget(commits)).toBeUndefined();
  });

  test('should fail if the PR contains a feat commit', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button fix'),
      splitStringIntoCommitMessage('fix(card): Added a card fix'),
    ];
    expect(validateCommitsForPatchTarget(commits)).toBeInstanceOf(PrError);
  });

  test('should fail if the PR contains only chore commit', () => {
    const commits = [
      splitStringIntoCommitMessage('chore(button): Added a button fix'),
      splitStringIntoCommitMessage('chore(card): Added a card fix'),
    ];
    expect(validateCommitsForPatchTarget(commits)).toBeInstanceOf(PrError);
  });
});
