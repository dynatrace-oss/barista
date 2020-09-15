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

import { FluidButtonGroup } from './button-group';
import { FluidButtonGroupItem } from '../button-group-item/button-group-item';
import { dispatchKeyboardEvent } from '@dynatrace/testing/browser';
import {
  SPACE,
  TAB,
  ARROW_LEFT,
  ARROW_RIGHT,
} from '@dynatrace/shared/keycodes';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid button-group', () => {
  let fixture: FluidButtonGroup;
  let changeSpy;

  beforeEach(() => {
    // Register the element, if it is not yet registered
    if (!customElements.get('fluid-button-group-item')) {
      customElements.define('fluid-button-group-item', FluidButtonGroupItem);
    }
    if (!customElements.get('fluid-button-group')) {
      customElements.define('fluid-button-group', FluidButtonGroup);
    }
    // create the fixture
    document.body.innerHTML = `
      <fluid-button-group>
        <fluid-button-group-item id="button1">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button2">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button3">I am the label</fluid-button-group-item>
      </fluid-button-group>`;
    fixture = document.querySelector<FluidButtonGroup>('fluid-button-group')!;

    // Add spied eventListeners
    changeSpy = jest.fn();
    fixture.addEventListener('checkedChange', changeSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the checkbox', async () => {
    expect(fixture).not.toBe(null);
  });

  describe('checkedId attribute', () => {
    it('should initially be undefined', async () => {
      expect(fixture.checkedId).toBeUndefined();
    });

    it('should set the checkedId if an item was clicked', async () => {
      const label = fixture
        .querySelector<FluidButtonGroupItem>('fluid-button-group-item')
        ?.shadowRoot?.querySelector('label');
      label!.click();
      await tick();
      expect(changeSpy).toHaveBeenCalledTimes(1);
      expect(fixture.checkedId).toBe('button1');
    });

    it('should set the checkedId if the item was checked using the keyboard', async () => {
      const svg = fixture
        .querySelector<FluidButtonGroupItem>('fluid-button-group-item')
        ?.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(svg!, 'keyup', SPACE);
      await tick();
      expect(fixture.checkedId).toBe('button1');
    });

    it('should set the corresponding button-group-item item to checked if the attribute is set', async () => {
      document.body.innerHTML = `
      <fluid-button-group checkedId="button1">
        <fluid-button-group-item id="button1">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button2">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button3">I am the label</fluid-button-group-item>
      </fluid-button-group>`;
      await tick();
      fixture = document.querySelector<FluidButtonGroup>('fluid-button-group')!;
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>('fluid-button-group-item')
          ?.checked,
      ).toBeTruthy();
    });

    it(`should throw error if checkedId doesn't exist`, async () => {
      document.body.innerHTML = `
      <fluid-button-group checkedId="button4">
        <fluid-button-group-item id="button1">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button2">I am the label</fluid-button-group-item>
        <fluid-button-group-item id="button3">I am the label</fluid-button-group-item>
      </fluid-button-group>`;
      await tick();
      fixture = document.querySelector<FluidButtonGroup>('fluid-button-group')!;
      await tick();
      expect(fixture.checkedId).toBe(null);
    });
  });

  describe('disableAll attribute', () => {
    it('should disable every item if attribute is set', async () => {
      fixture.setAttribute('disableAll', '');
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(1)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(3)',
        )?.disabled,
      ).toBe(true);
    });
    it('should disable every item if property is set to true', async () => {
      fixture.disableAll = true;
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(1)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(3)',
        )?.disabled,
      ).toBe(true);
    });
    it('should enable every item if property is reset', async () => {
      fixture.disableAll = true;
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(1)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )?.disabled,
      ).toBe(true);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(3)',
        )?.disabled,
      ).toBe(true);
      fixture.disableAll = false;
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(1)',
        )?.disabled,
      ).toBe(false);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )?.disabled,
      ).toBe(false);
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(3)',
        )?.disabled,
      ).toBe(false);
    });
  });

  describe('slotchange behaviour', () => {
    it('should set the tabindex attribute of the first available button-group-item to 0', async () => {
      document.body.innerHTML = `
      <fluid-button-group checkedId="button1">
        <fluid-button-group-item disabled id="button1">I am the label1</fluid-button-group-item>
        <fluid-button-group-item id="button2">I am the label2</fluid-button-group-item>
        <fluid-button-group-item id="button3">I am the label3</fluid-button-group-item>
      </fluid-button-group>`;
      await tick();
      fixture = document.querySelector<FluidButtonGroup>('fluid-button-group')!;
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )?.tabIndex,
      ).toBe(0);
    });

    it('should do nothing if no button-group-item is provided', async () => {
      document.body.innerHTML = `
      <fluid-button-group>
      </fluid-button-group>`;
      await tick();
      fixture = document.querySelector<FluidButtonGroup>('fluid-button-group')!;
      await tick();
      expect(fixture.checkedId).toBeUndefined();
    });
  });

  describe('auto select/deselect handler', () => {
    it('should automatically deselect the previous item', async () => {
      const label = fixture
        .querySelector<FluidButtonGroupItem>('fluid-button-group-item')
        ?.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      expect(fixture.checkedId).toBe('button1');
      const label2 = fixture
        .querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:last-child',
        )
        ?.shadowRoot?.querySelector('label');
      label2?.click();
      expect(fixture.checkedId).toBe('button3');
    });

    it(`should set the first item's tabindex to 0 if no checked item was found`, async () => {
      const label = fixture
        .querySelector<FluidButtonGroupItem>(
          'fluid-button-group-item:nth-child(2)',
        )
        ?.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      const item2 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item:nth-child(2)',
      )!;
      expect(item2.checked).toBeTruthy();
      item2.checked = false;
      await tick();
      const item1 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item',
      )!;
      await tick();
      expect(item2.checked).toBeFalsy();
      expect(item2.tabIndex).toBe(-1);
      expect(item1.tabIndex).toBe(0);
    });
  });

  describe('SPACE default scroll prevention', () => {
    it('should prevent the default scrolling', () => {
      const div = fixture.shadowRoot?.querySelector('div.fluid-button-group');
      const event = dispatchKeyboardEvent(div!, 'keydown', SPACE);
      expect(event.defaultPrevented).toBeTruthy();
    });
  });

  describe('keyboard support', () => {
    it('should set the tabbed attribute of the button-group-item with a tabindex 0 to true when pressing TAB', async () => {
      const svg = fixture
        .querySelector<FluidButtonGroupItem>('fluid-button-group-item')
        ?.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(svg!, 'keyup', TAB);
      await tick();
      expect(
        fixture.querySelector<FluidButtonGroupItem>('fluid-button-group-item')
          ?.tabbed,
      ).toBeTruthy();
    });

    it('should set the handle attributes when using arrow-left', async () => {
      const div = fixture.shadowRoot?.querySelector('div.fluid-button-group');
      dispatchKeyboardEvent(div!, 'keyup', ARROW_LEFT);
      await tick();
      const item1 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item',
      )!;
      const item2 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item:nth-child(2)',
      )!;
      const item3 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item:nth-child(3)',
      )!;
      expect(item1.tabbed).toBeFalsy();
      expect(item2.tabbed).toBeFalsy();
      expect(item3.tabbed).toBeTruthy();
      expect(item1.tabIndex).toBe(-1);
      expect(item2.tabIndex).toBe(-1);
      expect(item3.tabIndex).toBe(0);
    });
    it('should set the handle attributes when using arrow-left', async () => {
      const div = fixture.shadowRoot?.querySelector('div.fluid-button-group');
      dispatchKeyboardEvent(div!, 'keyup', ARROW_RIGHT);
      await tick();
      const item1 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item',
      )!;
      const item2 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item:nth-child(2)',
      )!;
      const item3 = fixture.querySelector<FluidButtonGroupItem>(
        'fluid-button-group-item:nth-child(3)',
      )!;
      expect(item1.tabbed).toBeFalsy();
      expect(item2.tabbed).toBeTruthy();
      expect(item3.tabbed).toBeFalsy();
      expect(item1.tabIndex).toBe(-1);
      expect(item2.tabIndex).toBe(0);
      expect(item3.tabIndex).toBe(-1);
    });
  });
});
