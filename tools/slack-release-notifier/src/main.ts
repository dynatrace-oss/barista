/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { getInput } from '@actions/core';
import { context, GitHub } from '@actions/github';
import { IncomingWebhook } from '@slack/webhook';
import { ReposGetReleaseByTagResponse } from '@octokit/rest';

import { getReleaseType, getTextForReleaseType } from './utils/release-type';
import { convertToSlackBlocks } from './utils/text-conversion';

function getReleaseTitle(release: ReposGetReleaseByTagResponse) {
  if (!release.name) {
    return release.tag_name;
  }

  return release.name.includes(release.tag_name)
    ? release.name
    : `${release.name} (${release.tag_name})`;
}

async function run(): Promise<void> {
  const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
  const githubToken = getInput('repo-token', { required: true });

  if (!slackWebhookUrl) {
    throw new Error(
      'An environment variable "SLACK_WEBHOOK_URL" should contain the webhook URL.',
    );
  }

  if (!context.ref.includes('/')) {
    throw new Error('Malformed tag ref');
  }

  // The ref in the context is formatted like 'ref/tags/1.0.0'.
  // The API expects only the tag string e.g. 1.0.0
  const splitTag = context.ref.split('/');
  const tag = splitTag[splitTag.length - 1];

  const client = new GitHub(githubToken);

  const release = (
    await client.repos.getReleaseByTag({
      owner: context.repo.owner,
      repo: context.repo.repo,
      tag,
    })
  ).data;

  const webhook = new IncomingWebhook(slackWebhookUrl);
  await webhook.send({
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `:fire: New ${context.repo.owner}/${context.repo.repo} release! :rocket:`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text:
            getTextForReleaseType(getReleaseType(release)) +
            `\n:package: ${getReleaseTitle(release)}`,
        },
        accessory: {
          type: 'button',
          text: {
            type: 'plain_text',
            text: 'View on GitHub :github:',
            emoji: true,
          },
          url: release.html_url,
        },
      },
      ...(convertToSlackBlocks(release.body) ||
        'Check out GitHub for more information.'),
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: 'Thanks to all contributors for helping us out!',
        },
      },
    ],
  });
}

run().catch((error) => {
  console.log(error);
  process.exit(1);
});
