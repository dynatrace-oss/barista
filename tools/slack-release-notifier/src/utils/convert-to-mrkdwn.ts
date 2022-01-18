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

import * as marked from 'marked';
import mrkdwn from 'html-to-mrkdwn';

/**
 * Slack's markdown implementation is different from GitHub's,
 * so we have to translate between the two.
 * @param input The GitHub flavored markdown input
 * @returns Slack "mrkdwn" string
 */
export function convertToMrkdwn(input: string): string {
  try {
    let parsedHtml = marked.parse(input); // We have to convert to HTML first
    return mrkdwn(parsedHtml).text;
  } catch (e) {
    // Just return the original body if there was an error
    console.warn('Body parsing warning: ', e);
    return input;
  }
}
