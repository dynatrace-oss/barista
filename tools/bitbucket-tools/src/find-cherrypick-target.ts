import {
  addTagsToPullRequest,
  updateCherryPickLabels,
} from './bitbucket-communication/add-tags-to-pull-request';
import { getCommitsForPullRequest } from './bitbucket-communication/get-commits-for-pull-request';
import {
  getPullRequestById,
  getPullRequestByRefId,
} from './bitbucket-communication/get-pull-request';
import { determineCherryPickLabelsForMasterTarget } from './cherry-pick-target/determine-cherry-pick-labels';
import { splitStringIntoCommitMessage } from './commit-message-validation/split-message-into-components';
import { PR_ID, REF_ID } from './config';
import { isReleasePullRequest } from './utils/pull-request-is-release-request';
import { isMasterTarget } from './utils/pull-request-target-check';

/**
 * Evaluates the commits of a given pull request and runs certain checks against
 * their types, to see where the commits need to be cherrypicked to.
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

  // If the PR is a release commit, for now just exit.
  // TODO: For cherry picking releases back to master, we will need to determine
  // the target here.
  if (isReleasePullRequest(pr)) {
    return;
  }

  // If the PR has a needs rebase in the title, it will not check the PR
  if (pr.title.includes('[needs-rebase]')) {
    console.log(
      'Pull request still needs a rebase and will therefor not be evaluated by the cherry picker',
    );
    return;
  }

  // If the PR has a cherrypick-needs-human in the title, it will not check the PR
  if (pr.title.includes('[cherrypick-needs-human]')) {
    console.log(
      'Pull request contains a cherrypick-needs-human hint and will therefor not be evaluated by the cherry picker',
    );
    return;
  }

  // get the commits for the given pull request
  const commitsForPR = await getCommitsForPullRequest(pr);
  // Parse the commits to make them more easily accessible by code.
  const parsedCommitsForPr = commitsForPR.map(splitStringIntoCommitMessage);

  if (isMasterTarget(pr.toRef)) {
    const determinedLabels = determineCherryPickLabelsForMasterTarget(
      parsedCommitsForPr,
    );
    console.log('Found parsed commits', determinedLabels);
    await updateCherryPickLabels(determinedLabels, pr);
  } else {
    await addTagsToPullRequest(['cherrypick-needs-human'], pr);
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
