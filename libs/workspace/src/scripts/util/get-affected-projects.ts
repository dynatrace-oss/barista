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

import { execSync } from 'child_process';

/** Get a list of affected libraries with the target */
export function getAffectedProjects(
  baseSha: string,
  target?: string,
): string[] {
  const command = [`npx nx print-affected`, `--base=${baseSha}`];

  if (target) {
    command.push(`--target=${target}`);
  }

  const affected = execSync(command.join(' ')).toString().trim();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const parsed = JSON.parse(affected) as any;

  return target
    ? parsed.tasks.map((task) => task.target.project).sort()
    : parsed.projects.sort();
}
