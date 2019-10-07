import { BaristaPullRequestTag } from '../bitbucket-communication/add-tags-to-pull-request';

const order: BaristaPullRequestTag[] = [
  'major',
  'minor',
  'patch',
  'blocked',
  'wip',
  'needs-work',
  'needs-rebase',
  'merge-ready',
  'cherrypick-needs-human',
  'target:minor',
  'target:patch',
];

export function sortPullRequestLabels(
  labels: BaristaPullRequestTag[],
): BaristaPullRequestTag[] {
  return labels.sort(
    (labelA, labelB) => order.indexOf(labelA) - order.indexOf(labelB),
  );
}
