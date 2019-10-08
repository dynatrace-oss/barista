import { CherryPickResult } from './cherry-pick-to-branch';

export function convertCherrypickResultToComments(
  result: CherryPickResult,
  openedPullRequest?: number,
): string {
  const comment: string[] = ['[AutoCherryPicker]'];

  if (result.success) {
    comment.push(':white_check_mark: Successfully cherry picked commits');
  } else {
    comment.push(':x: Failed to cherry pick due to conflicts');
    if (openedPullRequest) {
      comment.push(
        `The cherry picker has opened a pull request, please check it to resolve the conflicts #${openedPullRequest}`,
      );
    }
  }

  for (const message of result.messages) {
    const singleStep = [
      `${message.success ? ':white_check_mark:' : ':x:'} **${message.step}**`,
    ];
    if (message.message) {
      singleStep.push('```');
      singleStep.push(message.message);
      singleStep.push('```');
    }
    comment.push(...singleStep);
  }

  return comment.join('\n');
}
