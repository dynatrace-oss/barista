import {
  addTagsToPullRequest,
  removeTagsFromPullRequest,
} from './bitbucket-communication/add-tags-to-pull-request';
import { getCommitMessagesForPullRequest } from './bitbucket-communication/get-commits-for-pull-request';
import {
  getPullRequestById,
  getPullRequestByRefId,
} from './bitbucket-communication/get-pull-request';
import { sendCommentToPullRequest } from './bitbucket-communication/send-comment-to-pull-request';
import { convertErrorsToPullRequestComment } from './commit-message-validation/convert-errors-to-pull-request-comment';
import { splitStringIntoCommitMessage } from './commit-message-validation/split-message-into-components';
import { validateCommitsInPr } from './commit-message-validation/validate-commits-in-pull-request';
import { PR_ID, REF_ID } from './config';
import { isReleasePullRequest } from './utils/pull-request-is-release-request';

/**
 * Evaluates the commits of a given pull request and runs certain checks against
 * their messages to determine if they are considered valid.
 */
async function main(): Promise<void> {
  let pr;
  // Jenkins passes unknown variables as null string... smart jenkins
  if (PR_ID && PR_ID !== 'null') {
    pr = await getPullRequestById(PR_ID);
  } else if (REF_ID && REF_ID !== 'null') {
    pr = await getPullRequestByRefId(REF_ID);
  }

  // If there is no PR for this commit open yet, just exit.
  if (!pr) {
    console.log('Skipped out, because no pull request was found.');
    return;
  }
  // Get all commits for the current pull request.
  const commitsForPR = await getCommitMessagesForPullRequest(pr);
  // Get parsed commits to better handle them in the following process.
  const parsedCommitsForPr = commitsForPR.map(splitStringIntoCommitMessage);
  // Validate all commits and find the errors.
  const commitValidationErrors = validateCommitsInPr(
    parsedCommitsForPr,
    pr.toRef,
    isReleasePullRequest(pr),
  );

  // If there are validation errors in the PRs found add the needs-rebase label
  // to the pull request, otherwise remove it again.
  if (commitValidationErrors.length > 0) {
    await addTagsToPullRequest(['needs-rebase'], pr);
    await sendCommentToPullRequest(
      convertErrorsToPullRequestComment(commitValidationErrors),
      pr,
    );
  } else {
    await removeTagsFromPullRequest(['needs-rebase'], pr);
  }
}

main()
  .then(() => {
    console.log('done');
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
