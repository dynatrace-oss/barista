import { splitStringIntoCommitMessage } from '../split-message-into-components';
import { PrError } from '../validate-commits-in-pull-request';
import { validateNoMixingOfCommitTypes } from './validate-no-mixing-of-commit-types';

describe('No type mixing', () => {
  test('should pass if there is only one type of commits within the PR', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
      splitStringIntoCommitMessage('fix(button): Added a card fix'),
    ];
    expect(validateNoMixingOfCommitTypes(commits)).toBeUndefined();
  });
  test('should pass if there is only one commit on the PR', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
    ];
    expect(validateNoMixingOfCommitTypes(commits)).toBeUndefined();
  });

  test('should fail if there are multiple commitTypes in the PR', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
    ];
    expect(validateNoMixingOfCommitTypes(commits)).toBeInstanceOf(PrError);
  });

  test('should fail if there are multiple commitTypes in a large PR', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
      splitStringIntoCommitMessage('chore: Did something cumbersome'),
      splitStringIntoCommitMessage('build: Added a build step'),
    ];
    expect(validateNoMixingOfCommitTypes(commits)).toBeInstanceOf(PrError);
  });
});
