import { CommitMessage, CommitType } from '../interfaces/commit-message';

const expression = /(?<issue>APM-\d* )?(?<type>feat|fix|docs|style|refactor|perf|test|build|chore|barista)(?<component>\(.*?\))?:(?<message>.*)/i;
/**
 * Splits the commit message string into its own components. This helps for
 * further processing of the commit messages.
 * @param original Original string of the commit message.
 */
export function splitStringIntoCommitMessage(original: string): CommitMessage {
  const matching = original.match(expression);

  if (!matching) {
    throw new Error(`Message was not parsable: ${original}`);
  }

  const issueNumber = ((matching.groups && matching.groups.issue) || '').trim();
  const type = (
    (matching.groups && matching.groups.type) ||
    ''
  ).trim() as CommitType;
  const componentMatch = (
    (matching.groups && matching.groups.component) ||
    ''
  ).trim();
  const components = componentMatch
    .replace('(', '')
    .replace(')', '')
    .split(',')
    .map(component => (component || '').trim())
    .filter(Boolean);

  const message = ((matching.groups && matching.groups.message) || '').trim();

  const breakingChange = /(^| )break(ing)?( change)?/gim.test(
    message.toLowerCase(),
  );

  const releaseCommit = /chore: bump version to ([\d|\.].*?) w\/ changelog/gim.test(
    original.toLowerCase(),
  );

  return {
    issueNumber,
    type,
    components,
    message,
    breakingChange,
    releaseCommit,
    original,
  };
}
