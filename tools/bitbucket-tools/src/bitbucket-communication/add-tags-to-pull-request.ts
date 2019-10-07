import Axios from 'axios';

import {
  BITBUCKET_HOST,
  BITBUCKET_PASSWORD,
  BITBUCKET_PROJECT,
  BITBUCKET_REPO,
  BITBUCKET_USER,
} from '../config';
import { BitbucketApiPr } from '../interfaces/bitbucket/bitbucket-api-pull-request';

export type BaristaPullRequestTag =
  | 'needs-rebase'
  | 'needs-work'
  | 'merge-ready'
  | 'major'
  | 'minor'
  | 'patch'
  | 'blocked'
  | 'wip'
  | 'cherrypick-needs-human'
  | 'target:minor'
  | 'target:patch';

/**
 * Labels that can be applied by the CherryPick algorithm to determine
 * where the picker should move commits to.
 */
const cherryPickLabels: BaristaPullRequestTag[] = [
  'major',
  'minor',
  'patch',
  'cherrypick-needs-human',
  'target:minor',
  'target:patch',
];

interface PullRequestTitle {
  title: string;
  tags: BaristaPullRequestTag[];
}

/**
 * Splits the original title into tags and the text component to determine
 * easier which tags should be added or deleted.
 */
export function splitTitleIntoComponents(title: string): PullRequestTitle {
  // Get all tags from the title
  const reg = /\[(.*?)\]/gim;
  let match = reg.exec(title);
  const tags: string[] = [];
  while (match !== null) {
    tags.push(match[0]);
    match = reg.exec(title);
  }

  // Replace all tags in the original title
  const strippedTitle = tags
    .reduce((t, currentTag) => t.replace(currentTag, ''), title)
    .trim()
    .replace(/\s+/g, ' ');

  // Replace all occurrences of [ and ] in the tags
  const sanitizedTags: string[] = tags
    .map(t =>
      t
        .replace('[', '')
        .replace(']', '')
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);

  return {
    title: strippedTitle,
    tags: Array.from(new Set(sanitizedTags)) as BaristaPullRequestTag[],
  };
}

/** Converts the PullRequestTitle type back to a string. */
export function convertTitleComponentsToString(
  titleComponent: PullRequestTitle,
): string {
  const tagsString = titleComponent.tags.map(t => `[${t}]`).join(' ');
  return `${tagsString} ${titleComponent.title}`;
}

/** Actually makes the update request, if the new title differs from the previous one. */
async function updateTitle(
  pullRequest: BitbucketApiPr,
  parsedTitle: PullRequestTitle,
): Promise<void> {
  // Generate the new title
  const newTitle = convertTitleComponentsToString(parsedTitle);

  // If the title differs from the original, send the update request.
  if (newTitle !== pullRequest.title) {
    await Axios.put<void>(
      `${BITBUCKET_HOST}/rest/api/1.0/projects/${BITBUCKET_PROJECT}/repos/${BITBUCKET_REPO}/pull-requests/${pullRequest.id}`,
      {
        version: pullRequest.version,
        title: newTitle,
        reviewers: pullRequest.reviewers,
      },
      {
        auth: {
          username: BITBUCKET_USER,
          password: BITBUCKET_PASSWORD,
        },
      },
    );
    return;
  }
}

/**
 * Adds the requested tags/labels to a pull request.
 * @param tags Tags that should be added to the PR
 * @param pullRequest Pull request that should be edited.
 */
export async function addTagsToPullRequest(
  tags: BaristaPullRequestTag[],
  pullRequest: BitbucketApiPr,
): Promise<void> {
  const parsedTitle = splitTitleIntoComponents(pullRequest.title);

  // Add all requested tags
  for (const tag of tags) {
    if (!parsedTitle.tags.includes(tag)) {
      parsedTitle.tags.push(tag);
    }
  }
  await updateTitle(pullRequest, parsedTitle);
}

/**
 * Removes the requested tags/labels to a pull request.
 * @param tags Tags that should be added to the PR
 * @param pullRequest Pull request that should be edited.
 */
export async function removeTagsFromPullRequest(
  tags: BaristaPullRequestTag[],
  pullRequest: BitbucketApiPr,
): Promise<void> {
  const parsedTitle = splitTitleIntoComponents(pullRequest.title);

  // Filter out all passed labels.
  parsedTitle.tags = parsedTitle.tags.filter(t => !tags.includes(t));

  await updateTitle(pullRequest, parsedTitle);
}

/**
 * Adds the requested tags/labels to a pull request and removes previously set labels by the cherrypicker
 * @param tags Tags that should be added to the PR
 * @param pullRequest Pull request that should be edited.
 */
export async function updateCherryPickLabels(
  tags: BaristaPullRequestTag[],
  pullRequest: BitbucketApiPr,
): Promise<void> {
  const parsedTitle = splitTitleIntoComponents(pullRequest.title);

  // Filter out all cherry pick labels, to prevent conflicting labels being carried
  // over from previous checks.
  parsedTitle.tags = parsedTitle.tags.filter(
    t => !cherryPickLabels.includes(t),
  );

  // Add all requested tags
  for (const tag of tags) {
    if (!parsedTitle.tags.includes(tag)) {
      parsedTitle.tags.push(tag);
    }
  }

  await updateTitle(pullRequest, parsedTitle);
}
