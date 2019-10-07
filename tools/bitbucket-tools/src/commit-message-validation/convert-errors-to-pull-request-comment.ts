import { PrError, PrErrorType } from './validate-commits-in-pull-request';

const messages = new Map<PrErrorType, string[]>();
messages.set('NoTypeMixing', [
  '* __No mixing of commit types__',
  'Please do not mix commit types like feat/fix/chore within one pull request. Either reduce your pull request to a single commit type.',
  '*Keep in mind that feat/fix/perf commits allow only a single commit per pull request.*',
]);
messages.set('SquashMe', [
  '* __Commit messages contain squash notices__',
  'We noticed that there are still "squash", "squash me" or other arbitraty commit messages within this pull request. Please clean up the commit messages',
]);
messages.set('SingleFeatureCommitPerScope', [
  '* __Single Feature-scope per pull request__',
  'Please consider splitting up your pull request when you are creating features for multiple scopes.',
  'If the same feature targets multiple scopes consider combining them into the same commit i.e. instead of feat(button) and feat(card), use feat(button, card)',
]);
messages.set('SingleCommitPerFeatFixPerf', [
  '* __Single purpose pull request__',
  'To keep pull requests focused on a single purpose, there is only a single feat/fix/perf commit per pull request preferred.',
  'This is not a hard limit and should only act as a guideline.',
  '*Please split multpile features, fixes or performance improvements into their own pull requests or squash your commits together.*',
]);
messages.set('BreakingChangeViolation', [
  '* __Breaking change violation__',
  'We have detected a word like "break" or "breaking". If this pull request contains a breaking change, please use the keyword `BREAKING CHANGE`',
]);
messages.set('PatchTargetAllowsOnlyFixes', [
  '* __Pull request targets a patch branch and contains non-fix commits__',
  'Fixes should generally be targeting the master branch. They will be cherry picked into their respective patch release version after merge.',
  'The only exception would be for version backports. Version backports can only include fix commits.',
]);
messages.set('MinorTargetAllowsOnlyFeatures', [
  '* __Pull request targets a minor branch and contains non-feat commits__',
  'Features should generally be targeting the master branch. They will be cherry picked into their respective minor release version after merge',
]);
messages.set('BreakingChangeAllowsOnlyMasterTarget', [
  '* __Pull request contains breaking changes but does not target master branch__',
  'We have detected that the pull request contains breaking keyworded commit messages. BREAKING CHANGES can only target the master branch.',
]);

/** Converts the errors array to a comment string. */
export function convertErrorsToPullRequestComment(errors: PrError[]): string {
  const commentString: string[] = [
    '# PR/Commit message validator',
    '',
    "This validator is currently in it's evaluation phase and will not be blocking your pull-request. We are trying to evolve ways to improve our automation process and make it easier for you to contribute.",
  ];
  for (const error of errors) {
    const message = messages.get(error.error) || [];
    commentString.push(...message);

    // Add an additional message, if squash me notice is found.
    if (error.error === 'SquashMe') {
      commentString.push(error.message);
    }
    commentString.push('');
  }

  return commentString.join('\n');
}
