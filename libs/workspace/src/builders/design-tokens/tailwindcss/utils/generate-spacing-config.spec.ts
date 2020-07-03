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
import { generateSpacings } from './generate-spacing-config';

describe('[Design tokens tailwind] generate spacing', () => {
  describe('generate spacing config', () => {
    it('should generate the spacing config correctly', () => {
      const input: DesignTokenSource = {
        aliases: {
          'spacing--0': '0',
          'spacing--3x-small': '2px',
          'spacing--medium': '16px',
          'spacing--large': '18px',
          'spacing--2x-large': '20px',
        },
      };
      expect(generateSpacings(input)).toMatchObject({
        '0': '0',
        '3xs': '2px',
        m: '16px',
        l: '18px',
        '2xl': '20px',
      });
    });
  });
});
