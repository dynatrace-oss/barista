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

import { FluidSwitch } from './switch';
import { SPACE } from '@angular/cdk/keycodes';
import { dispatchKeyboardEvent } from '@dynatrace/testing/browser';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid switch', () => {
  let fixture: FluidSwitch;
  let changeSpy: jest.Mock;

  function switchIsOn(): boolean {
    const svg = fixture.shadowRoot?.querySelector('svg');
    return Boolean(svg?.classList.contains('checked'));
  }

  beforeEach(() => {
    // Register the element, if it is not yet registered
    if (!customElements.get('fluid-switch')) {
      customElements.define('fluid-switch', FluidSwitch);
    }
    // create the fixture
    document.body.innerHTML =
      '<fluid-switch>I am the switch label</fluid-switch>';
    fixture = document.querySelector<FluidSwitch>('fluid-switch')!;

    // Add spied eventListeners
    changeSpy = jest.fn();
    fixture.addEventListener('change', changeSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the switch', async () => {
    expect(fixture).not.toBe(null);
  });

  describe('checked attribute', () => {
    it('should set the state to checked when the attribute is set to true', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(switchIsOn()).toBeTruthy();
    });

    it('should set the state to checked when the property is set to true', async () => {
      fixture.checked = true;
      await tick();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(switchIsOn()).toBeTruthy();
    });

    it('should set the state to unchecked when the property is set to false', async () => {
      fixture.checked = false;
      await tick();
      expect(fixture.hasAttribute('checked')).toBeFalsy();
      expect(switchIsOn()).toBeFalsy();
    });

    it('should not be checked after the attribute was added and removed', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      fixture.removeAttribute('checked');
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(switchIsOn()).toBeFalsy();
    });

    it('should change the checked state if the label is clicked', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(switchIsOn()).toBeTruthy();
    });

    it('should unset change the checked state if the label is clicked twice', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      label?.click();
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(switchIsOn()).toBeFalsy();
    });

    it('should change the checked state when triggered by keyboard', async () => {
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(checkbox!, 'keyup', SPACE);
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(switchIsOn()).toBeTruthy();
    });
  });

  describe('disabled attribute', () => {
    it('should set the disabled state when the attribute is present', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input')!;
      expect(shadowedInput.hasAttribute('disabled')).toBeTruthy();
    });

    it('should set the disabled state when the attribute is set', async () => {
      fixture.setAttribute('disabled', 'disabled');
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input')!;
      expect(shadowedInput.hasAttribute('disabled')).toBeTruthy();
    });

    it('should set the disabled state when the property is set', async () => {
      fixture.disabled = true;
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input')!;
      expect(shadowedInput.hasAttribute('disabled')).toBeTruthy();
    });

    it('should reset the disabled state when the attribute is removed', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      fixture.removeAttribute('disabled');
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input')!;
      expect(shadowedInput.hasAttribute('disabled')).toBeFalsy();
    });

    it('should reflect the disabled attribute to the host', async () => {
      fixture.disabled = true;
      await tick();
      expect(fixture.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('value', () => {
    it('should set the default value to on', async () => {
      const shadowedInput = fixture.shadowRoot?.querySelector('input');
      expect(shadowedInput?.getAttribute('value')).toBe('on');
    });

    it('should set the value to customvalue when the property is set', async () => {
      fixture.value = 'customvalue';
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input');
      expect(shadowedInput?.getAttribute('value')).toBe('customvalue');
    });

    it('should set the value to customvalue when the attribute is set', async () => {
      fixture.setAttribute('value', 'customvalue');
      await tick();
      const shadowedInput = fixture.shadowRoot?.querySelector('input');
      expect(shadowedInput?.getAttribute('value')).toBe('customvalue');
    });
  });

  describe('tabindex', () => {
    it('should have a tabindex on the triggerable element when enabled', () => {
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      expect(checkbox?.hasAttribute('tabindex')).toBeTruthy();
      expect(checkbox?.getAttribute('tabindex')).toBe('0');
    });

    it('should have a tabindex of -1 on the triggerable element when disabled', async () => {
      fixture.disabled = true;
      await tick();
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      expect(checkbox?.hasAttribute('tabindex')).toBeTruthy();
      expect(checkbox?.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('toggle method', () => {
    it('should toggle the switch on when called on an unchecked element', async () => {
      fixture.toggle();
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(switchIsOn()).toBeTruthy();
    });

    it('should toggle the switch on when called on a checked element', async () => {
      fixture.checked = true;
      await tick();
      fixture.toggle();
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(switchIsOn()).toBeFalsy();
    });
  });

  describe('change event', () => {
    it('should emit the change event when the switch is toggled via click', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit the change event when the checkbox is clicked', async () => {
      const checkbox = fixture.shadowRoot?.querySelector('input');
      checkbox!.click();
      await tick();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit the change event when the switch is toggled via click', async () => {
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(checkbox!, 'keyup', SPACE);
      await tick();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
