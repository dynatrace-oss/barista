/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

import { Prop } from 'theo';

/** Renders a comment in from a prop */
export function renderComment(prop: Prop): string {
  // Early exit if there is no comment in there
  if (!prop.has('comment')) {
    return '';
  }

  // If there is a comment defined, generate a multi line
  // comment output
  const comment = (prop.get('comment') as string)
    .split('\n')
    .map((line) => ` * ${line}`)
    .join('\n');

  return ['/*', comment, ' */'].join('\n');
}
