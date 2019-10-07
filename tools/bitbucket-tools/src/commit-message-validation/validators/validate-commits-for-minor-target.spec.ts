import { splitStringIntoCommitMessage } from '../split-message-into-components';
import { PrError } from '../validate-commits-in-pull-request';
import { validateCommitsForMinorTarget } from './validate-commits-for-minor-target';

describe('if target branch is minor, only feat are allowed', () => {
  test('should pass if there is a feat commit against a patch branch', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feat'),
    ];
    expect(validateCommitsForMinorTarget(commits)).toBeUndefined();
  });

  test('should fail if the PR contains a feat commit', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button fix'),
      splitStringIntoCommitMessage('fix(card): Added a card fix'),
    ];
    expect(validateCommitsForMinorTarget(commits)).toBeInstanceOf(PrError);
  });

  test('should fail if the PR contains only chore commit', () => {
    const commits = [
      splitStringIntoCommitMessage('chore(button): Added a button fix'),
      splitStringIntoCommitMessage('chore(card): Added a card fix'),
    ];
    expect(validateCommitsForMinorTarget(commits)).toBeInstanceOf(PrError);
  });
});
