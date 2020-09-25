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

import { FluidComboBox } from './combo-box';

describe('Fluid combo-box', () => {
  let fixture: FluidComboBox<any>;

  beforeEach(() => {
    if (!customElements.get('fluid-combo-box')) {
      customElements.define('fluid-combo-box', FluidComboBox);
    }
    document.body.innerHTML = `
        <fluid-combo-box
          label="ComboBox"
          placeholder="Select something"
          arialabel="This is a fluid-combo-box"
          multiselect
        ></fluid-combo-box>
      `;
    fixture = document.querySelector<FluidComboBox<any>>(`fluid-combo-box`)!;
  });

  it('should create the combo-box', async () => {
    expect(fixture).not.toBe(null);
  });
});
