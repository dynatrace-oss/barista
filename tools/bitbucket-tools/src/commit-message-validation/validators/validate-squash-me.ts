import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';
/**
 * Validates if the message contains any squashMe, squash-me or other hints
 * that the commits should be renamed before merging.
 */
export function validateSquashMe(message: string): ValidatorResult {
  const m = message.toLowerCase();
  const containsSquash = /squash ?(me)?/i.test(m);
  if (containsSquash) {
    return new PrError(
      'SquashMe',
      `Commit message \`${message}\` contains a "Squash me" message, please clean up your commits.`,
    );
  }
  const containsRebase = /rebase/i.test(m);
  if (containsRebase) {
    return new PrError(
      'SquashMe',
      `Commit message \`${message}\` contains a "rebase" message, please clean up your commits.`,
    );
  }
  const containsGibberish = /asdf/i.test(m);
  if (containsGibberish) {
    return new PrError(
      'SquashMe',
      `Commit message \`${message}\` contains a "asdf", please clean up your commits.`,
    );
  }
}
