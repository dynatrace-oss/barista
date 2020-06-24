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

import { DesignTokenSource } from '../../interfaces/design-token-source';

/** Generate a spacing configruation to use within the tailwind config file. */
export function generateSpacings(
  spacingAliasSource: DesignTokenSource,
): {
  [spacingKey: string]: string;
} {
  const spacings = spacingAliasSource.aliases!;
  const spacingConfig = {};
  for (const [name, value] of Object.entries(spacings)) {
    const transformedKey = name
      .replace('spacing--', '')
      // Replace the sizing with an abbreviated name, small => s, medium =>l
      .replace('small', 's')
      .replace('medium', 'm')
      .replace('large', 'l')
      // replace all spacers that are left
      .replace(/-/g, '');
    spacingConfig[transformedKey] = value;
  }

  return spacingConfig;
}
