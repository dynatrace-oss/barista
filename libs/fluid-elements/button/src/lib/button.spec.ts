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

import { FluidButton } from './button';

function tick(): Promise<void> {
  return Promise.resolve();
}

describe('Fluid button', () => {
  let fixture: FluidButton;

  beforeEach(() => {
    if (!customElements.get('fluid-button')) {
      customElements.define('fluid-button', FluidButton);
    }
    document.body.innerHTML = '<fluid-button>Hello</fluid-button>';
    fixture = document.querySelector<FluidButton>('fluid-button')!;
  });

  it('should create the button', async () => {
    expect(fixture).not.toBe(null);
  });

  it('should add the default classes to the shadow root', () => {
    const classList = Array.from(
      fixture.shadowRoot?.querySelector('button')?.classList!,
    );
    expect(classList).toContain('fluid-button');
    expect(classList).toContain('fluid-color--main');
    expect(classList).toContain('fluid-emphasis--medium');
    expect(classList).toContain('fluid-size--large');
  });

  describe('color attribute', () => {
    it('should update the color when the attribute is set', async () => {
      fixture.setAttribute('color', 'positive');
      await tick();
      const classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-color--positive');
    });

    it('should update the color when the property is set', async () => {
      fixture.color = 'error';
      await tick();
      const classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-color--error');
    });

    it('should fall back to the default when removing the color attribute', async () => {
      fixture.setAttribute('color', 'error');
      await tick();
      fixture.removeAttribute('color');
      await tick();

      const classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-color--main');
    });

    it('should fall back to the default when setting the property to null', async () => {
      fixture.color = 'error';
      await tick();
      fixture.color = null;
      await tick();

      const classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-color--main');
    });
  });

  describe('size attribute', () => {
    it('should update the size when the attribute is set', async () => {
      fixture.setAttribute('size', 'small');
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--small');
    });

    it('should update the size when the property is set', async () => {
      fixture.size = 'medium';
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--medium');
    });

    it('should fall back to the default when removing the attribute', async () => {
      fixture.setAttribute('size', 'small');
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--small');
      fixture.removeAttribute('size');
      await tick();
      classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--large');
    });

    it('should fall back to the default when setting the property to null ', async () => {
      fixture.size = 'small';
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--small');
      fixture.size = null;
      await tick();
      classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-size--large');
    });
  });

  describe('emphasis attribute', () => {
    it('should update the emphasis when the attribute is set', async () => {
      fixture.setAttribute('emphasis', 'high');
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--high');
    });

    it('should update the emphasis when the property is set', async () => {
      fixture.emphasis = 'low';
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--low');
    });

    it('should fall back to the default when removing the attribute', async () => {
      fixture.setAttribute('emphasis', 'high');
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--high');
      fixture.removeAttribute('emphasis');
      await tick();
      classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--medium');
    });

    it('should fall back to the default when setting the property to null ', async () => {
      fixture.emphasis = 'high';
      await tick();
      let classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--high');
      fixture.emphasis = null;
      await tick();
      classList = Array.from(
        fixture.shadowRoot?.querySelector('button')?.classList!,
      );
      expect(classList).toContain('fluid-emphasis--medium');
    });
  });

  describe('disabled attribute', () => {
    it('should set the disabled state when the attribute is present', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      const shadowedButton = fixture.shadowRoot?.querySelector('button')!;
      expect(shadowedButton.hasAttribute('disabled')).toBe(true);
    });

    it('should set the disabled state when the attribute is set', async () => {
      fixture.setAttribute('disabled', 'disabled');
      await tick();
      const shadowedButton = fixture.shadowRoot?.querySelector('button')!;
      expect(shadowedButton.hasAttribute('disabled')).toBe(true);
    });

    it('should set the disabled state when the property is set', async () => {
      fixture.disabled = true;
      await tick();
      const shadowedButton = fixture.shadowRoot?.querySelector('button')!;
      expect(shadowedButton.hasAttribute('disabled')).toBe(true);
    });

    it('should reset the disabled state when the attribute is removed', async () => {
      fixture.setAttribute('disabled', '');
      await tick();
      fixture.removeAttribute('disabled');
      await tick();
      const shadowedButton = fixture.shadowRoot?.querySelector('button')!;
      expect(shadowedButton.hasAttribute('disabled')).toBe(false);
    });

    it('should reflect the disabled attribute to the host', async () => {
      fixture.disabled = true;
      await tick();
      expect(fixture.hasAttribute('disabled')).toBeTruthy();
    });
  });

  describe('click handler', () => {
    let mockHandler;
    beforeEach(() => {
      mockHandler = jest.fn();
      fixture.addEventListener('click', mockHandler);
    });
    it('should call the handler when clicked', async () => {
      fixture.click();
      expect(mockHandler).toHaveBeenCalled();
    });

    // TODO: Figure out how we can disable click interaction
    // without the use of css.
    // It works in the browser for native clicks, because the pointer-events styling
    // kicks in. But in the tests it's somehow hard to reproduce
    // with a call to .click()... Doesn't work in lion as well.
    // it('should not call the handler when clicking on a disabled button', async() => {
    //   fixture.disabled = true;
    //   await tick();
    //   fixture.click();
    //   expect(mockHandler).not.toHaveBeenCalled();
    // });
  });
});
