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

import { FluidTabGroup } from './tab-group';
import {
  dispatchKeyboardEvent,
  dispatchFakeEvent,
} from '@dynatrace/testing/browser';
import { ARROW_RIGHT, SPACE } from '@dynatrace/shared/keycodes';
import { FluidTab } from '../tab/tab';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid tab group', () => {
  let fixture: FluidTabGroup;
  let activeTabChangedSpy: jest.Mock;
  let keyupSpy: jest.Mock;
  let blurSpy: jest.Mock;

  /** Get the first tab in the fluid-tab-group */
  function getFirstSpanElementFromFluidTab(): HTMLSpanElement {
    return fixture
      .querySelector('fluid-tab')
      ?.shadowRoot?.querySelector('span')!;
  }

  /** Get the last tab in the fluid-tab-group */
  function getLastSpanElementFromFluidTab(): HTMLSpanElement {
    return fixture
      .querySelector('fluid-tab:last-child')
      ?.shadowRoot?.querySelector('span')!;
  }

  beforeEach(() => {
    // Register the element, if it is not yet registed
    if (!customElements.get('fluid-tab')) {
      customElements.define('fluid-tab', FluidTab);
    }
    if (!customElements.get('fluid-tab-group')) {
      customElements.define('fluid-tab-group', FluidTabGroup);
    }
    // create the fixture
    document.body.innerHTML = `
      <fluid-tab-group>
        <fluid-tab tabid="section1">
          Section 1
        </fluid-tab>
        <fluid-tab tabid="section2">
          Section 2
        </fluid-tab>
      </fluid-tab-group>
      `;
    fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;

    // Add spied eventListeners
    activeTabChangedSpy = jest.fn();
    fixture.addEventListener('activeTabChanged', activeTabChangedSpy);

    keyupSpy = jest.fn();
    fixture.addEventListener('keyup', keyupSpy);

    blurSpy = jest.fn();
    fixture.addEventListener('blur', blurSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the tabs', async () => {
    expect(fixture).not.toBe(null);
  });

  describe('activetabid attribute', () => {
    it('should set the initial active tab', async () => {
      expect(fixture.getAttribute('activeTabId')).toBe('section1');
    });

    it('should set active tab when property is set', async () => {
      fixture.activeTabId = 'section2';
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
    });

    it('should set last activetabid attribute when a tab is clicked', async () => {
      const tab = getLastSpanElementFromFluidTab();
      tab?.click();
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
    });

    it('should set last activetabid attribute when using key events', async () => {
      const tab = fixture.querySelector<FluidTab>('fluid-tab');
      tab?.focus();
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section1');
      dispatchKeyboardEvent(tab!, 'keyup', ARROW_RIGHT);
      await tick();
      expect(keyupSpy).toBeCalledTimes(1);
      dispatchKeyboardEvent(document.activeElement!, 'keyup', SPACE);
      await tick();
      expect(activeTabChangedSpy).toHaveBeenCalledTimes(1);
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
    });

    it('should represent the correct activetabid if the tab itself is set to active', async () => {
      await tick();
      const tab = fixture.querySelector<FluidTab>('fluid-tab:last-child');
      tab!.active = true;

      await tick();
      expect(tab?.active).toBeTruthy();
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
    });
  });

  describe('tabindex attribute', () => {
    it('should set tabindex to 0 when tab is clicked', async () => {
      const tab = getFirstSpanElementFromFluidTab();
      tab?.click();
      await tick();
      fixture.querySelector<FluidTab>('fluid-tab:last-child')!.click();
      getLastSpanElementFromFluidTab().click();
      await tick();
      expect(getFirstSpanElementFromFluidTab().getAttribute('tabindex')).toBe(
        '-1',
      );
      expect(getLastSpanElementFromFluidTab().getAttribute('tabindex')).toBe(
        '0',
      );
    });

    it('should set tabindex to 0 when tab is selected using keys', async () => {
      const tab = fixture.querySelector<FluidTab>('fluid-tab');
      tab?.focus();
      await tick();
      dispatchKeyboardEvent(tab!, 'keyup', ARROW_RIGHT);
      await tick();
      dispatchKeyboardEvent(document.activeElement!, 'keyup', SPACE);
      await tick();
      expect(getFirstSpanElementFromFluidTab().getAttribute('tabindex')).toBe(
        '-1',
      );
      expect(getLastSpanElementFromFluidTab().getAttribute('tabindex')).toBe(
        '0',
      );
    });

    it('should set tabindex to -1 when tab is disabled', async () => {
      fixture
        .querySelector<FluidTab>('fluid-tab')
        ?.setAttribute('disabled', 'true');
      await tick();
      expect(getFirstSpanElementFromFluidTab().getAttribute('tabindex')).toBe(
        '-1',
      );
    });
  });

  describe('activeTabChanged event', () => {
    it('should fire an event when a tab is clicked', async () => {
      const tab = getLastSpanElementFromFluidTab();
      tab?.click();
      await tick();
      expect(activeTabChangedSpy).toBeCalledTimes(1);
    });

    it('should fire an event when using the key events', async () => {
      const tab = fixture.querySelector<FluidTab>('fluid-tab');
      tab?.focus();
      dispatchKeyboardEvent(tab!, 'keyup', ARROW_RIGHT);
      await tick();
      dispatchKeyboardEvent(document.activeElement!, 'keyup', SPACE);

      expect(activeTabChangedSpy).toBeCalledTimes(1);
    });
  });

  describe('active tab behaviour', () => {
    it('should override the tab-groups activeTabId attribute if the tab istelf is set to active', async () => {
      document.body.innerHTML = `
      <fluid-tab-group activeTabId="section2">
        <fluid-tab tabid="section1" active>
          Section 1
        </fluid-tab>
        <fluid-tab tabid="section2">
          Section 2
        </fluid-tab>
      </fluid-tab-group>
      `;

      fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;
      await tick();
      expect(
        getFirstSpanElementFromFluidTab().classList.contains(
          'fluid-state--active',
        ),
      ).toBeTruthy();
    });

    it('should set a available tab active after removing the currently active tab', async () => {
      document.body.innerHTML = `
      <fluid-tab-group>
        <fluid-tab tabid="section1">
          Section 1
        </fluid-tab>
        <fluid-tab tabid="section2">
          Section 2
        </fluid-tab>
        <fluid-tab tabid="section3">
          Section 3
        </fluid-tab>
      </fluid-tab-group>
      `;
      // Ticking twice otherwise the dom isn't updated.
      await tick();
      await tick();
      fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section1');

      document.body.innerHTML = `
      <fluid-tab-group>
        <fluid-tab tabid="section2">
          Section 2
        </fluid-tab>
        <fluid-tab tabid="section3">
          Section 3
        </fluid-tab>
      </fluid-tab-group>
      `;
      // Ticking twice otherwise the dom isn't updated.
      await tick();
      await tick();
      fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
    });

    it('should set the active tab correctly after removing all tabs', async () => {
      expect(fixture.getAttribute('activeTabId')).toBe('section1');
      document.body.innerHTML = `
      <fluid-tab-group>
      </fluid-tab-group>
      `;
      // Ticking twice otherwise the dom isn't updated.
      await tick();
      await tick();
      fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe(null);
    });

    it('should set the active tab correctly after removing all tabs after interaction', async () => {
      getLastSpanElementFromFluidTab()?.click();
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe('section2');
      document.body.innerHTML = `
      <fluid-tab-group>
      </fluid-tab-group>
      `;
      // Ticking twice otherwise the dom isn't updated.
      await tick();
      await tick();
      fixture = document.querySelector<FluidTabGroup>('fluid-tab-group')!;
      await tick();
      expect(fixture.getAttribute('activeTabId')).toBe(null);
    });
  });

  describe('blur Event', () => {
    it('should fire event when a tab is blurred', async () => {
      const tab = fixture.querySelector<FluidTab>('fluid-tab');
      tab?.focus();
      await tick();
      dispatchKeyboardEvent(tab!, 'keyup', ARROW_RIGHT);
      await tick();
      dispatchFakeEvent(getLastSpanElementFromFluidTab(), 'blur');
      await tick();
      expect(blurSpy).toHaveBeenCalledTimes(1);
      expect(
        fixture.querySelector<FluidTab>('fluid-tab:last-child')?.tabindex,
      ).toBe(-1);
      expect(fixture.querySelector<FluidTab>('fluid-tab')?.tabindex).toBe(0);
    });
  });
});
