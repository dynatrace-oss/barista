import { getCommitHashesForPullRequest } from './bitbucket-communication/get-commits-for-pull-request';
import { getPackageVersionFromTargetRef } from './bitbucket-communication/get-package-version-From-target-ref';
import { getPullRequestById } from './bitbucket-communication/get-pull-request';
import { openPullRequest } from './bitbucket-communication/open-pull-request';
import { sendCommentToPullRequest } from './bitbucket-communication/send-comment-to-pull-request';
import { cherryPickCommitsToTargetBranch } from './cherry-pick/cherry-pick-to-branch';
import { cloneRepository } from './cherry-pick/clone-repository';
import { convertCherrypickResultToComments } from './cherry-pick/convert-cherrypick-result-to-comments';
import { PR_ID } from './config';
import { BitbucketApiPr } from './interfaces/bitbucket/bitbucket-api-pull-request';

/** Performs the cherry picking process for a single target. */
async function performCherryPickForTarget(
  target: 'minor' | 'patch',
  version: string,
  commitsInPullRequest: string[],
  remoteUrl: string,
  pullRequest: BitbucketApiPr,
) {
  // Try to cherry pick the minor branch into the minor target branch
  const cherryPickResult = cherryPickCommitsToTargetBranch(
    target,
    version,
    commitsInPullRequest,
    remoteUrl,
    pullRequest.id,
  );

  // If the cherrypick fails, open a pull request for the newly created branch.
  let openedMinorPullRequest;
  if (!cherryPickResult.success && cherryPickResult.conflictBranch) {
    openedMinorPullRequest = await openPullRequest(
      `Cherry pick conflict for PR #${pullRequest.id}`,
      convertCherrypickResultToComments(cherryPickResult),
      cherryPickResult.conflictBranch,
      cherryPickResult.targetBranch!,
    );
  }

  // Send a comment to the original pull request about the state of the cherry pick.
  sendCommentToPullRequest(
    convertCherrypickResultToComments(
      cherryPickResult,
      openedMinorPullRequest && openedMinorPullRequest.id,
    ),
    pullRequest,
  );
}

/**
 * Evaluates the commits of a given pull request and runs certain checks against
 * their types, to see where the commits need to be cherrypicked to.
 */
async function main(): Promise<void> {
  if (!PR_ID) {
    console.log('Skipped out, because no pull request was found.');
  }
  const pullRequest = await getPullRequestById(PR_ID);

  // If the cherry picker should be skipped add a comment
  // to the pull request and exit out.
  if (pullRequest.title.includes('[cherrypick-needs-human]')) {
    await sendCommentToPullRequest(
      '[AutoCherryPicker]: Skipping cherry pick because of [cherrypick-needs-human] label.',
      pullRequest,
    );
    return;
  }

  // Get the commit hashes that need to be cherry-picked
  const commitsInPullRequest = await getCommitHashesForPullRequest(pullRequest);
  const version = await getPackageVersionFromTargetRef(
    pullRequest,
    pullRequest.toRef,
  );

  // Get the remote url of the repository from the pull request data
  const remoteUrl = pullRequest.toRef.repository.links.clone.find(
    link => link.name === 'http',
  )!.href;

  // If there is something to cherry pick, perform a checkout of the remote
  if (
    pullRequest.title.includes('[target:minor]') ||
    pullRequest.title.includes('[target:patch]')
  ) {
    const cloneRepoResult = cloneRepository(remoteUrl);
    if (!cloneRepoResult) {
      await sendCommentToPullRequest(
        `[AutoCherryPicker]: Failed to clone ${remoteUrl}. Please cherry-pick it yourself`,
        pullRequest,
      );
      return;
    }
  }
  // We need to reverse the commits to keep them in the correct order as they were
  const reversedCommits = commitsInPullRequest.reverse();

  // If the pull request is labelled with target minor, execute the cherry-picking
  // to the minor branch.
  if (pullRequest.title.includes('[target:minor]')) {
    performCherryPickForTarget(
      'minor',
      version,
      reversedCommits,
      remoteUrl,
      pullRequest,
    );
  }
  if (pullRequest.title.includes('[target:patch]')) {
    performCherryPickForTarget(
      'patch',
      version,
      reversedCommits,
      remoteUrl,
      pullRequest,
    );
  }
  console.log(commitsInPullRequest, version);
}

main()
  .then(() => {
    console.log('done');
  })
  .catch(error => {
    console.log(error);
    process.exit(1);
  });
