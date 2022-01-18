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

import { SectionBlock } from '@slack/types';
import { convertToMrkdwn } from './convert-to-mrkdwn';

/**
 * Captures the '#' symbols as "heading" and the following text as "text"
 */
const MARKDOWN_HEADING_CAPTURE = /^(?<heading>#+) (?<text>.*)/gm;

/** Max amount of characters per block (https://api.slack.com/reference/block-kit/blocks#section) */
const SLACK_BLOCK_LENGTH_LIMIT = 3000;

/** Limit of items per block to prevent too long messages */
const MAX_ITEMS_PER_CATEGORY = 25;

/**
 * Splits the text into blocks for Slack
 * and makes the release notes friendlier by highlighting some headers with emoji
 * @param markdownInput The markdown input from GitHub
 * @returns A fancier version of the markdown input
 */
export function convertToSlackBlocks(markdownInput: string): SectionBlock[] {
  const lines = markdownInput.split('\n');

  const blocks: SectionBlock[] = [];
  let currentBlockLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const headingData = tryGetHeading(line);

    if (headingData || i == lines.length - 1) {
      // Ensure creating a block at the end
      if (currentBlockLines.length > 0) {
        blocks.push({
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: limitBlockText(currentBlockLines.map(convertToMrkdwn)),
          },
        });
        currentBlockLines = [];
      }

      currentBlockLines.push(
        !!headingData
          ? processHeading(headingData.heading, headingData.text)
          : line,
      );
    } else {
      currentBlockLines.push(line);
    }
  }

  return blocks;
}

function limitBlockText(blockLines: string[]): string {
  if (blockLines.length > MAX_ITEMS_PER_CATEGORY) {
    blockLines = [
      ...blockLines.slice(0, MAX_ITEMS_PER_CATEGORY),
      ":warning: I've omitted some items because this section of the release notes is" +
        'too long for me to display. Please view them on GitHub.',
    ];
  }
  // We might still hit the slack length limit in rare cases, so cut off the message in this case
  // to ensure that Slack doesn't reject the entire message
  return blockLines.join('\n').substring(0, SLACK_BLOCK_LENGTH_LIMIT);
}

function processHeading(heading: string, text: string): string {
  const textLc = text.toLowerCase();

  if (textLc.includes('fix')) {
    // Bug fixes
    return fancifyLine(heading, text, ':beetle:');
  }
  if (textLc.includes('refactor')) {
    // Refactoring
    return fancifyLine(heading, text, ':wrench:');
  }
  if (textLc.includes('break')) {
    // Breaking changes
    return fancifyLine(heading, text, ':rotating_light:', ':collision:');
  }
  if (textLc.includes('feature')) {
    // New features
    return fancifyLine(heading, text, ':gift:');
  }
  if (textLc.includes('performance')) {
    // Performance improvements
    return fancifyLine(heading, text, ':athletic_shoe:');
  }

  return fancifyLine(heading, text, ':memo:'); // Other
}

function fancifyLine(
  heading: string,
  text: string,
  startEmoji: string,
  endEmoji?: string,
): string {
  return `${heading} ${startEmoji} ${text} ${endEmoji || ''}`;
}

/** Returns the heading '#' chars and text if the current line is a heading or null otherwise */
function tryGetHeading(line: string): { heading: string; text: string } | null {
  const match = MARKDOWN_HEADING_CAPTURE.exec(line);
  if (!match || !match.groups) {
    return null;
  }

  const { heading, text } = match.groups;
  return { heading, text };
}
