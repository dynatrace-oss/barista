import { GitClient } from '../../../release/git-client';
import { LOCAL_GIT_REPO_PATH } from '../config';
import { addAuthorizationToRemoteUrl } from '../utils/add-username-password-to-remote';
import {
  getMinorBranchForVersion,
  getPatchBranchForVersion,
} from '../utils/get-branch-for-version';

export interface CherryPickResult {
  success: boolean;
  messages: CherryPickMessage[];
  conflictBranch?: string;
  targetBranch?: string;
}

interface CherryPickMessage {
  step: string;
  message?: string;
  success?: boolean;
}

/**
 * Execute the cherry picking of commits to the minor branch. The function returns
 * the output of the cherry pick.
 */
export function cherryPickCommitsToTargetBranch(
  target: 'minor' | 'patch',
  version: string,
  commits: string[],
  remoteUrl: string,
  pullrequestNumber: number,
): CherryPickResult {
  let success = true;

  const gitClient = new GitClient(
    LOCAL_GIT_REPO_PATH,
    addAuthorizationToRemoteUrl(remoteUrl),
  );
  const messages: CherryPickMessage[] = [];

  // ensure that the target repository is on the correct branch
  // checkout the target branch
  const checkoutResponse = gitClient.checkoutBranch('master');
  messages.push({ step: 'Checkout master', success: checkoutResponse });

  // Determine the actual target branch
  const targetBranch =
    target === 'minor'
      ? getMinorBranchForVersion(version)
      : getPatchBranchForVersion(version);

  if (!targetBranch) {
    success = false;
    messages.push({
      step: `Determine ${target} version`,
      message: `Was not able to determine ${target} version for ${targetBranch}`,
    });
    return {
      success,
      messages,
    };
  }

  // Checkout the target branch
  const checkoutTargetBranchResponse = gitClient.checkoutBranch(targetBranch);
  messages.push({
    step: `Checkout ${targetBranch}`,
    success: checkoutTargetBranchResponse,
  });
  // If checking out the target branch fails, exit.
  if (!checkoutTargetBranchResponse) {
    return {
      success: false,
      messages,
      targetBranch,
    };
  }

  // Name of the conflicting branch, if this happens.
  let conflictBranch;

  // Cherry pick the commits
  // We need to iterate over the commits in reverse, to keep their
  // order.
  for (const commit of commits) {
    const cherryPickResult = gitClient.cherrypick(commit);

    // Add the cherry-pick result to the output.
    messages.push({
      step: `Cherry pick commit ${commit}`,
      message: cherryPickResult.output,
      success: cherryPickResult.success,
    });

    // If the cherry-pick fails, handle the conflict situation
    if (!cherryPickResult.success) {
      // If we have branched off once, we do not need to do this again.
      if (!conflictBranch) {
        success = false;
        conflictBranch = `cherrypick-${target}-${pullrequestNumber}`;
        const branchOff = gitClient.checkoutNewBranch(conflictBranch);
        messages.push({
          step: 'Branch off due to conflict',
          success: branchOff,
        });
        // If the branching fails, return
        if (!branchOff) {
          return {
            success,
            messages,
            conflictBranch: undefined,
            targetBranch,
          };
        }
      }

      // Add the conflicting files
      const stageFiles = gitClient.stageAllChanges();
      messages.push({
        step: `Stage conflicting files from cherry-picking ${commit}`,
        success: stageFiles,
      });

      // Commit the conflicting files.
      const commitFiles = gitClient.createNewCommit(
        `chore: Conflicts resulting from cherry-picking ${commit}`,
      );
      messages.push({
        step: `Conflicts resulting from cherry-picking ${commit}`,
        success: commitFiles,
      });
    }
  }

  // Push the current branch
  const pushToRemote = gitClient.pushBranchOrTagToRemote(
    conflictBranch || targetBranch,
  );
  messages.push({
    step: `Pushed branch to remote ${conflictBranch || targetBranch}`,
    success: pushToRemote,
  });

  return {
    success,
    messages,
    conflictBranch,
    targetBranch,
  };
}
