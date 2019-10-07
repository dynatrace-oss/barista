import { PrError, ValidatorResult } from '../validate-commits-in-pull-request';
/**
 * Validates if the message contains any breaking change names or other hints
 * that the commit introduces breaking changes.
 */
export function validateBreakingChange(message: string): ValidatorResult {
  const hasBreakingMessage = /(^| )break(ing)?( change)?/gim.test(
    message.toLowerCase(),
  );
  if (!hasBreakingMessage) {
    return;
  }
  if (message.indexOf('BREAKING CHANGE') < 0) {
    return new PrError(
      'BreakingChangeViolation',
      'Commit contains breaking wording, if it is really a breaking change, please use BREAKING CHANGE in the commit.',
    );
  }
}
