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

import { FluidButtonGroupItem } from './button-group-item';
import { SPACE, ENTER } from '@dynatrace/shared/keycodes';
import {
  dispatchKeyboardEvent,
  dispatchFakeEvent,
  tick,
} from '@dynatrace/testing/browser';

/** Checks if the current fixture is displaying the checkmark */
function showsNob(fixture: FluidButtonGroupItem): boolean {
  const svg = fixture.shadowRoot?.querySelector('svg');
  return Boolean(svg?.classList.contains('fluid-state--checked'));
}

describe('Fluid button-group', () => {
  let fixture: FluidButtonGroupItem;
  let changeSpy;

  beforeEach(() => {
    // Register the element, if it is not yet registered
    if (!customElements.get('fluid-button-group-item')) {
      customElements.define('fluid-button-group-item', FluidButtonGroupItem);
    }
    // create the fixture
    document.body.innerHTML =
      '<fluid-button-group-item>I am the label</fluid-button-group-item>';
    fixture = document.querySelector<FluidButtonGroupItem>(
      'fluid-button-group-item',
    )!;

    // Add spied eventListeners
    changeSpy = jest.fn();
    fixture.addEventListener('checkedChange', changeSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the button-group-item', () => {
    expect(fixture).not.toBe(null);
  });

  describe('Checked Attribute', () => {
    it('should set the state to checked when the attribute is set', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
    });

    it('should set the state to checked when the attribute is set true', async () => {
      fixture.setAttribute('checked', 'true');
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.getAttribute('checked')).toBe('true');
      expect(showsNob(fixture)).toBeTruthy();
    });

    it('should set the state to checked when the property is set to true', async () => {
      fixture.checked = true;
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
    });

    it('should set the state to unchecked when the attribute is set to true then to false', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
      fixture.removeAttribute('checked');
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(fixture.getAttribute('checked')).toBeNull();
      expect(showsNob(fixture)).toBeFalsy();
    });

    it('should set the state to unchecked when the property is set to true then to false', async () => {
      fixture.checked = true;
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
      fixture.checked = false;
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(fixture.getAttribute('checked')).toBeNull();
      expect(showsNob(fixture)).toBeFalsy();
    });

    it('should set the state to checked if the label is clicked', async () => {
      fixture.shadowRoot?.querySelector('label')?.click();
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
    });

    it('should set the state to checked when using the SPACE key', async () => {
      const svg = fixture.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(svg!, 'keyup', SPACE);
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
    });

    it('should set the state to checked when using the TAB key', async () => {
      const svg = fixture.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(svg!, 'keyup', ENTER);
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsNob(fixture)).toBeTruthy();
    });
  });

  describe('Disabled attribute', () => {
    it('should set disabled state when the attribute is set', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      expect(fixture.disabled).toBeTruthy();
      expect(fixture.hasAttribute('disabled')).toBeTruthy();
    });

    it('should set disabled state when the attribute is set to true', async () => {
      fixture.setAttribute('disabled', 'true');
      await tick();
      expect(fixture.disabled).toBeTruthy();
      expect(fixture.hasAttribute('disabled')).toBeTruthy();
    });

    it('should set disabled state when the property is set to true', async () => {
      fixture.disabled = false;
      await tick();
      expect(fixture.disabled).toBeFalsy();
      expect(fixture.hasAttribute('disabled')).toBeFalsy();
    });

    it('should unset disabled state when the attribute is set to false', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      fixture.removeAttribute('disabled');
      await tick();
      expect(fixture.disabled).toBeFalsy();
      expect(fixture.hasAttribute('disabled')).toBeFalsy();
    });

    it('should unset disabled state when the property is set to false', async () => {
      fixture.disabled = true;
      await tick();
      fixture.disabled = false;
      await tick();
      expect(fixture.disabled).toBeFalsy();
      expect(fixture.hasAttribute('disabled')).toBeFalsy();
    });
  });

  describe('Name attribute', () => {
    it('should not have a name by default', async () => {
      expect(fixture.name).toBeUndefined();
    });

    it('should set the name when setting the attribute', async () => {
      fixture.setAttribute('name', 'button-group-item');
      await tick();
      expect(fixture.name).toBe('button-group-item');
    });

    it('should set the name if the property is set', async () => {
      fixture.name = 'button-group-item';
      await tick();
      expect(fixture.name).toBe('button-group-item');
      expect(
        fixture.shadowRoot?.querySelector('input')?.getAttribute('name'),
      ).toBe('button-group-item');
    });
  });

  describe('Value attribute', () => {
    it('should not have a value by default', async () => {
      expect(fixture.value).toBeUndefined();
    });

    it('should set the value when setting the attribute', async () => {
      fixture.setAttribute('value', 'button-group-item');
      await tick();
      expect(fixture.value).toBe('button-group-item');
    });

    it('should set the value if the property is set', async () => {
      fixture.value = 'button-group-item';
      await tick();
      expect(fixture.value).toBe('button-group-item');
      expect(
        fixture.shadowRoot?.querySelector('input')?.getAttribute('value'),
      ).toBe('button-group-item');
    });
  });

  describe('Tabindex attribute', () => {
    it('should set the tabindex based on disabled', async () => {
      fixture.disabled = true;
      await tick();
      fixture.tabIndex = 0;
      await tick();
      expect(fixture.tabIndex).toBe(-1);
    });

    it('should set the tabindex based on disabled', async () => {
      fixture.disabled = false;
      await tick();
      fixture.tabIndex = 0;
      await tick();
      expect(fixture.tabIndex).toBe(0);
    });
  });

  describe('aria-checked attribute', () => {
    it('should have aria-checked set to false by default', () => {
      expect(fixture.hasAttribute('aria-checked')).toBeTruthy();
      expect(fixture.getAttribute('aria-checked')).toBe('false');
    });

    it('should have aria-checked set to false when the checkbox is not checked', async () => {
      fixture.checked = false;
      await tick();
      expect(fixture.hasAttribute('aria-checked')).toBeTruthy();
      expect(fixture.getAttribute('aria-checked')).toBe('false');
    });

    it('should have aria-checked set to true when the checkbox is checked', async () => {
      fixture.checked = true;
      await tick();
      expect(fixture.hasAttribute('aria-checked')).toBeTruthy();
      expect(fixture.getAttribute('aria-checked')).toBe('true');
    });
  });

  describe('Space default scroll prevention', () => {
    it('should prevent the default scroll behaviour', async () => {
      const svg = fixture.shadowRoot?.querySelector('svg');
      const event = dispatchKeyboardEvent(svg!, 'keydown', SPACE);
      expect(event.defaultPrevented).toBeTruthy();
    });
  });

  describe('Blur event', () => {
    it('should set the tabbed state to false after a blur event', async () => {
      fixture.tabbed = true;
      const svg = fixture.shadowRoot?.querySelector('svg')!;
      dispatchFakeEvent(svg, 'blur', true);
      expect(fixture.tabbed).toBeFalsy();
    });
  });
});
