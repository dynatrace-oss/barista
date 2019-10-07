import { splitStringIntoCommitMessage } from '../split-message-into-components';
import { PrError } from '../validate-commits-in-pull-request';
import { validateNumberOfCommitsForFeatureFixPerformance } from './validate-number-of-commits-for-feature-fix-performance';

describe('Single responsibity PR, only one feat/fix/perf commit per PR', () => {
  test('should pass if there is only one feature commit', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeUndefined();
  });
  test('should pass if there is only one fix commit', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeUndefined();
  });
  test('should pass if there is only one perf commit', () => {
    const commits = [
      splitStringIntoCommitMessage(
        'perf(button): Added a button performance improvement',
      ),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeUndefined();
  });
  test('should fail if there are multiple feature commits', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button feature'),
      splitStringIntoCommitMessage('feat(card): Added a card feature'),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeInstanceOf(PrError);
  });
  test('should fail if there are multiple fix commits', () => {
    const commits = [
      splitStringIntoCommitMessage('fix(button): Added a button fix'),
      splitStringIntoCommitMessage('fix(card): Added a card fix'),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeInstanceOf(PrError);
  });
  test('should fail if there are multiple perf commits', () => {
    const commits = [
      splitStringIntoCommitMessage(
        'perf(button): Added a button performance improvement',
      ),
      splitStringIntoCommitMessage(
        'perf(card): Added a card performance improvement',
      ),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeInstanceOf(PrError);
  });
  test('should pass if there is are a lot of other commits', () => {
    const commits = [
      splitStringIntoCommitMessage(
        'chore(button): Added a button chore improvement',
      ),
      splitStringIntoCommitMessage(
        'chore(button): Added a button chore improvement',
      ),
      splitStringIntoCommitMessage(
        'chore(button): Added a button chore improvement',
      ),
      splitStringIntoCommitMessage(
        'chore(button): Added a button chore improvement',
      ),
    ];
    expect(
      validateNumberOfCommitsForFeatureFixPerformance(commits),
    ).toBeUndefined();
  });
});
