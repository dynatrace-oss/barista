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

import { FluidCheckbox } from './checkbox';
import { SPACE } from '@angular/cdk/keycodes';
import { dispatchKeyboardEvent } from '@dynatrace/testing/browser';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid button', () => {
  let fixture: FluidCheckbox;
  let changeSpy: jest.Mock;
  let indeterminateChangeSpy: jest.Mock;

  /** Checks if the current fixture is displaying the checkmark */
  function showsCheckmark(): boolean {
    const svg = fixture.shadowRoot?.querySelector('svg');
    return Boolean(svg?.classList.contains('fluid-state--checked'));
  }

  /** Checks if the current fixture is displaying the indeterminate line */
  function showsIndeterminate(): boolean {
    const svg = fixture.shadowRoot?.querySelector('svg');
    return Boolean(svg?.classList.contains('fluid-state--indeterminate'));
  }

  beforeEach(() => {
    // Register the element, if it is not yet registed
    if (!customElements.get('fluid-checkbox')) {
      customElements.define('fluid-checkbox', FluidCheckbox);
    }
    // create the fixture
    document.body.innerHTML =
      '<fluid-checkbox>I am the checkbox label</fluid-checkbox>';
    fixture = document.querySelector<FluidCheckbox>('fluid-checkbox')!;

    // Add spied eventListeners
    changeSpy = jest.fn();
    fixture.addEventListener('change', changeSpy);
    indeterminateChangeSpy = jest.fn();
    fixture.addEventListener('indeterminateChange', indeterminateChangeSpy);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should create the checkbox', async () => {
    expect(fixture).not.toBe(null);
  });

  describe('checked attribute', () => {
    it('should set the state to checked when the attribute is set to true', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(showsCheckmark()).toBeTruthy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should set the state to checked when the property is set to true', async () => {
      fixture.checked = true;
      await tick();
      expect(fixture.hasAttribute('checked')).toBeTruthy();
      expect(showsCheckmark()).toBeTruthy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should set the state to unchecked when the property is set to false', async () => {
      fixture.checked = false;
      await tick();
      expect(fixture.hasAttribute('checked')).toBeFalsy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should not be checked after the attribute was added and removed', async () => {
      fixture.setAttribute('checked', '');
      await tick();
      fixture.removeAttribute('checked');
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should change the checked state if the label is clicked', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      // We need to call click on the label instead of dispatching a MouseEvent
      // on the label, as jsdom will not fire secondary events (label to input connection)
      // click() has a shimmed implementation that will trigger input changes as
      // the browser does.
      label?.click();
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(showsCheckmark()).toBeTruthy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should unset change the checked state if the label is clicked twice', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      label?.click();
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    // tslint:disable-next-line: dt-no-focused-tests
    it.skip('should change the checked state when triggered by keyboard', async () => {
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      dispatchKeyboardEvent(checkbox!, 'keyup', SPACE);
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(showsCheckmark()).toBeTruthy();
      expect(showsIndeterminate()).toBeFalsy();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('indeterminate attribute', () => {
    it('should show the indeterminate state if the attribute is set', async () => {
      fixture.setAttribute('indeterminate', '');
      await tick();
      expect(fixture.indeterminate).toBeTruthy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeTruthy();
    });

    it('should show the indeterminate state if the property is set', async () => {
      fixture.indeterminate = true;
      await tick();
      expect(fixture.hasAttribute('indeterminate')).toBeTruthy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeTruthy();
    });

    it('should not show the indeterminate state if the attribute is added and removed again', async () => {
      fixture.setAttribute('indeterminate', '');
      await tick();
      fixture.removeAttribute('indeterminate');
      await tick();
      expect(fixture.indeterminate).toBeFalsy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should show only the indeterminate state, even if checked is set already', async () => {
      fixture.checked = true;
      await tick();
      fixture.indeterminate = true;
      await tick();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeTruthy();
    });

    it('should show only the indeterminate state, even if checked is set in the same cycle', async () => {
      fixture.checked = true;
      fixture.indeterminate = true;
      await tick();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeTruthy();
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

  describe('tabindex', () => {
    it('should have a tabindex on the triggerable element when enabled', () => {
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      expect(checkbox?.hasAttribute('tabindex')).toBeTruthy();
      expect(checkbox?.getAttribute('tabindex')).toBe('0');
    });

    it('should have a tabindex of -1 on the triggerable element when disabeld', async () => {
      fixture.disabled = true;
      await tick();
      const checkbox = fixture.shadowRoot?.querySelector('svg');
      expect(checkbox?.hasAttribute('tabindex')).toBeTruthy();
      expect(checkbox?.getAttribute('tabindex')).toBe('-1');
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

    it('should have aria-checked set to mixed when the checkbox is indeterminate and not checked', async () => {
      fixture.checked = false;
      fixture.indeterminate = true;
      await tick();
      expect(fixture.hasAttribute('aria-checked')).toBeTruthy();
      expect(fixture.getAttribute('aria-checked')).toBe('mixed');
    });

    it('should have aria-checked set to mixed when the checkbox is indeterminate and checked', async () => {
      fixture.checked = true;
      fixture.indeterminate = true;
      await tick();
      expect(fixture.hasAttribute('aria-checked')).toBeTruthy();
      expect(fixture.getAttribute('aria-checked')).toBe('mixed');
    });
  });

  describe('toggle method', () => {
    it('should toggle the checkmark on when called on an unchecked element', async () => {
      fixture.toggle();
      await tick();
      expect(fixture.checked).toBeTruthy();
      expect(showsCheckmark()).toBeTruthy();
      expect(showsIndeterminate()).toBeFalsy();
    });

    it('should toggle the checkmark on when called on a checked element', async () => {
      fixture.checked = true;
      await tick();
      fixture.toggle();
      await tick();
      expect(fixture.checked).toBeFalsy();
      expect(showsCheckmark()).toBeFalsy();
      expect(showsIndeterminate()).toBeFalsy();
    });
  });

  describe('change event', () => {
    it('should emit the change event when the checkbox is toggled via click', async () => {
      const label = fixture.shadowRoot?.querySelector('label');
      label?.click();
      await tick();
      expect(changeSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('indeterminateChange event', () => {
    it('should emit the changeIndeterminate event when it is set', async () => {
      fixture.indeterminate = true;
      await tick();
      expect(indeterminateChangeSpy).toHaveBeenCalledTimes(1);
    });

    it('should emit the changeIndeterminate event when it is set and again unset', async () => {
      fixture.indeterminate = true;
      await tick();
      fixture.indeterminate = false;
      await tick();
      expect(indeterminateChangeSpy).toHaveBeenCalledTimes(2);
    });

    it('should only fire the event once when indeterminate is set to the same value', async () => {
      fixture.indeterminate = true;
      await tick();
      fixture.indeterminate = true;
      await tick();
      expect(indeterminateChangeSpy).toHaveBeenCalledTimes(1);
    });
  });
});
