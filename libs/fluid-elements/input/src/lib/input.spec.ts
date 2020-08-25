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

import { FluidInput } from './input';

describe('Fluid input', () => {
  let fixture: FluidInput;

  beforeEach(() => {
    if (!customElements.get('fluid-input')) {
      customElements.define('fluid-input', FluidInput);
    }
    document.body.innerHTML =
      '<fluid-input hint="FluidInput hint."><label slot="label">Fluid Input Label</label><input type="text" placeholder="Fluid Input" /></fluid-input>';
    fixture = document.querySelector<FluidInput>('fluid-input')!;
  });

  it('should create the input', async () => {
    expect(fixture).not.toBe(null);
  });
});
