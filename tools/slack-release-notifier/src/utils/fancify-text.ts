/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

/**
 * Captures the '#' symbols as "heading" and the following text as "text"
 */
const MARKDOWN_HEADING_CAPTURE = /^(?<heading>#+) (?<text>.*)/gm;

/**
 * Makes the release notes friendlier by highlighting some headers with emoji
 * @param markdownInput The markdown input from GitHub
 * @returns A fancier version of the markdown input
 */
export function fancifyText(markdownInput: string): string {
  const lines = markdownInput.split('\n');

  for (let i = 0; i < lines.length; i++) {
    lines[i] = processLine(lines[i]);
  }

  return lines.join('\n');
}

function processLine(line: string): string {
  const match = MARKDOWN_HEADING_CAPTURE.exec(line);
  if (!match || !match.groups) {
    // Only process headings
    return line;
  }

  const { heading, text } = match.groups;
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
