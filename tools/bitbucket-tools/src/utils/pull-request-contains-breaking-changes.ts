import { CommitMessage } from '../interfaces/commit-message';

/** Determines if the commits list contains a breaking change. */
export function pullRequestContainsBreakingChanges(
  commits: CommitMessage[],
): boolean {
  return commits.filter(commit => commit.breakingChange).length >= 1;
}
