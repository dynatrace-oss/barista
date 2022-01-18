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

import { exec, ExecOptions } from 'child_process';

/**
 * Spawns a shell then executes the command within that shell
 */
export async function executeCommand(
  command: string,
  cwd?: string,
): Promise<string> {
  const maxBuffer = 1024 * 1024 * 10;

  const options: ExecOptions = {
    cwd: cwd || process.cwd(),
    maxBuffer,
  };

  return new Promise((resolve, reject) => {
    exec(command, options, (err, stdout, _) => {
      if (err !== null) {
        reject(stdout);
      } else {
        resolve(stdout);
      }
    });
  });
}
