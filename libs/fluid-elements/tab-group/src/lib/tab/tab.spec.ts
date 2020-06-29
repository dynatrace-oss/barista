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

import { FluidTab } from './tab';

function tick(): Promise<void> {
  return Promise.resolve();
}

function getTabRootElement(
  fixture: FluidTab,
): HTMLSpanElement | null | undefined {
  return fixture.shadowRoot?.querySelector('span');
}

describe('Fluid tab', () => {
  let fixture: FluidTab;
  let tabActivated: jest.Mock;

  /** Checks if the current fixture has an active tab */
  function isActive(): boolean {
    return (
      fixture.shadowRoot?.querySelector('fluid-state--active') !== undefined
    );
  }

  beforeEach(() => {
    // Register the element, if it is not yet registed
    if (!customElements.get('fluid-tab')) {
      customElements.define('fluid-tab', FluidTab);
    }
    // create the fixture
    document.body.innerHTML = `
      <fluid-tab>
        Section
      </fluid-tab>
      `;

    // Add spied eventListeners
    fixture = document.querySelector<FluidTab>('fluid-tab')!;

    tabActivated = jest.fn();
    fixture.addEventListener('tabActivated', tabActivated);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the tabs', async () => {
    expect(fixture).not.toBe(null);
  });

  describe('active attribute', () => {
    // Attributes: tabid, disabled, active
    it('should set the state to active when the attribute is set to true', async () => {
      fixture.setAttribute('active', '');
      await tick();
      expect(fixture.active).toBeTruthy();
      expect(isActive()).toBeTruthy();
    });

    it('should set the state to active when the attribute is set to true', async () => {
      fixture.active = true;
      await tick();
      expect(fixture.active).toBeTruthy();
      expect(isActive()).toBeTruthy();
    });
  });

  describe('disabled attribute', () => {
    // Should set the disabled state when the attribute is present
    it('Should set the disabled state when the attribute is present', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      const shadowLi = getTabRootElement(fixture)!;
      expect(shadowLi.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should set the disabled state when the attribute is set', async () => {
      fixture.setAttribute('disabled', 'true');
      await tick();
      const shadowLi = getTabRootElement(fixture)!;
      expect(shadowLi.hasAttribute('disabled')).toBeTruthy();
    });

    // Should set the disabled state when the property is set
    it('Should set the disabled state when the property is set', async () => {
      fixture.disabled = true;
      await tick();
      const shadowLi = getTabRootElement(fixture)!;
      expect(shadowLi.hasAttribute('disabled')).toBeTruthy();
    });

    it('Should reset the disabled state when the attribute is removed', async () => {
      fixture.removeAttribute('disabled');
      await tick();
      const shadowLi = getTabRootElement(fixture)!;
      expect(shadowLi.hasAttribute('disabled')).toBeFalsy();
    });

    // Should reflect the disabled state attribute to the host
    it('Should reflect the disabled state attribute to the host', async () => {
      fixture.disabled = true;
      await tick();
      expect(fixture.hasAttribute('disabled')).toBeTruthy();
    });

    it('should set active to false when disabled is true', async () => {
      fixture.disabled = true;
      await tick();
      expect(fixture.active).toBeFalsy();
    });

    it('should set tabindex to -1 when disabled is true', async () => {
      fixture.disabled = true;
      await tick();
      expect(fixture.tabindex).toBe(-1);
    });
  });

  describe('tabActivated', () => {
    it('should fire event when tab is clicked', async () => {
      getTabRootElement(fixture)?.click();
      await tick();
      expect(tabActivated).toHaveBeenCalledTimes(1);
    });
  });
});
