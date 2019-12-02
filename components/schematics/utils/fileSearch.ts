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

import { sync as glob } from 'glob';
import { readFileSync } from 'fs';

export function getFilesToCheck(pattern: string): string[] {
  const toExcludeFiles = glob('**/.gitignore');
  let ignorePattern: string[] = [];
  toExcludeFiles.map(patterns => {
    ignorePattern.push(readFileSync(patterns, 'utf-8'));
  });

  ignorePattern.forEach(i =>
    i
      .replace(/^#.+/gm, '')
      .split('\n')
      .filter(line => line.length > 0),
  );

  const files = glob(pattern, {
    ignore: [...ignorePattern, 'node_modules/**', 'dist/**'],
  });

  return files;
}
