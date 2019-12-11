import { PackageJson } from '../util/json-utils';

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
 * Updates the placeholders in the peerDependencies of the release json
 * to the versions found in the root package json
 */
export function syncPeerDependencyPlaceholder(
  releaseJson: PackageJson,
  packageJson: PackageJson,
  placeholder: string,
): PackageJson {
  const updatedJson = { ...releaseJson };
  for (const [key, value] of Object.entries(releaseJson.peerDependencies)) {
    if (value.includes(placeholder)) {
      updatedJson.peerDependencies[key] = packageJson.dependencies[key];
    }
  }
  return updatedJson;
}
