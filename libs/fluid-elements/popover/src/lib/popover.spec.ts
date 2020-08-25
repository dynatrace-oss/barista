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

import { FluidPopover } from './popover';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe(`Fluid popover`, () => {
  let fixture: FluidPopover;

  beforeEach(() => {
    if (!customElements.get(`fluid-popover`)) {
      customElements.define(`fluid-popover`, FluidPopover);
    }
    document.body.innerHTML = `<fluid-popover>Test</fluid-popover>`;
    fixture = document.querySelector<FluidPopover>(`fluid-popover`)!;
  });

  it(`should create the popover`, async () => {
    expect(fixture).not.toBe(null);
  });

  it(`should add the default classes to the shadow root`, () => {
    const classList = Array.from(
      fixture.shadowRoot?.querySelector(`div`)?.classList!,
    );
    expect(classList).toContain(`fluid-popover`);
    expect(classList).not.toContain(`fluid-popover--open`);
  });

  describe(`open attribute`, () => {
    it(`should update the class list when the attribute is set`, async () => {
      fixture.setAttribute(`open`, `true`);
      await tick();
      const classList = Array.from(
        fixture.shadowRoot?.querySelector(`div`)?.classList!,
      );
      expect(classList).toContain(`fluid-popover--open`);
    });

    it(`should update the class list when the property is set`, async () => {
      fixture.open = true;
      await tick();
      const classList = Array.from(
        fixture.shadowRoot?.querySelector(`div`)?.classList!,
      );
      expect(classList).toContain(`fluid-popover--open`);
    });

    it(`should fall back to the default when removing the open attribute`, async () => {
      fixture.setAttribute(`open`, `true`);
      await tick();
      fixture.removeAttribute(`open`);
      await tick();

      const classList = Array.from(
        fixture.shadowRoot?.querySelector(`div`)?.classList!,
      );
      expect(classList).not.toContain(`fluid-popover--open`);
      expect(fixture.open).toBeFalsy();
    });
  });

  describe(`placement attribute`, () => {
    it(`should set default if the attribute is not provided`, async () => {
      expect(fixture.getAttribute(`placement`)).toEqual(`bottom-start`);
    });

    it(`should update the attribute when the property is set`, async () => {
      fixture.placement = `bottom-end`;
      await tick();
      expect(fixture.getAttribute(`placement`)).toEqual(`bottom-end`);
    });

    it(`should update the property when the attribute is set`, async () => {
      fixture.setAttribute(`placement`, `bottom-end`);
      await tick();
      expect(fixture.placement).toEqual(`bottom-end`);
    });
  });
});
