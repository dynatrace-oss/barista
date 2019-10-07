import { splitStringIntoCommitMessage } from '../commit-message-validation/split-message-into-components';
import { pullRequestContainsBreakingChanges } from './pull-request-contains-breaking-changes';

describe('commits contain breaking changes', () => {
  it('should return true when the commits contain breaking changes', () => {
    const commits = [
      splitStringIntoCommitMessage(
        'feat(button): Added a button fix BREAKING CHANGE',
      ),
    ];
    expect(pullRequestContainsBreakingChanges(commits)).toBe(true);
  });

  it('should return false when the commits do not contain breaking changes', () => {
    const commits = [
      splitStringIntoCommitMessage('feat(button): Added a button fix'),
    ];
    expect(pullRequestContainsBreakingChanges(commits)).toBe(false);
  });
});
