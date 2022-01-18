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

import { Rule } from '@angular-devkit/schematics';
import { PackageJson } from '../../../interfaces/package-json.interface';
import { updateDependency, updateJsonInTree } from '../../../utils';

/**
 * @internal
 * Updates all the necessary dependencies for the new major Version 7.
 */
export function updateDependenciesRule(): Rule {
  return updateJsonInTree<PackageJson>('/package.json', (json) => {
    updateDependency(json, '@dynatrace/barista-components', '^8.0.0');
    updateDependency(json, '@dynatrace/barista-icons', '^7.5.0');

    return json;
  });
}
