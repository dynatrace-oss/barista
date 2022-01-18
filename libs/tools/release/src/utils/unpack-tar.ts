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

import { executeCommand } from '@dynatrace/shared/node';

/**
 * Unpacks a tar file
 *
 * @param tarFile Path to the tar file
 * @param destination Location where the tar file should be unpacked in
 *
 * TODO: lukas.holzer write a operating system independent version of this function
 */
export async function unpackTarFile(
  tarFile: string,
  destination: string,
): Promise<void> {
  await executeCommand(`tar -xzf ${tarFile} -C ${destination}`);
}
