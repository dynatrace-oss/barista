/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtButtonModule } from './button-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtButton', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtButtonModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [TestApp, IconOnlyButton],
      });

      TestBed.compileComponents();
    }),
  );

  // Regular button tests
  describe('button[dt-button]', () => {
    it('should handle a click on the button', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'));

      buttonDebugElement.nativeElement.click();
      expect(testComponent.clickCount).toBe(1);
    });

    it('should not increment if disabled', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();

      expect(testComponent.clickCount).toBe(0);
    });

    it('should disable the native button element', () => {
      const fixture = createComponent(TestApp);
      const buttonNativeElement =
        fixture.debugElement.nativeElement.querySelector('button');

      // Expected button not to be disabled
      expect(buttonNativeElement.disabled).toBeFalsy();

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();

      // Expected button to be disabled
      expect(buttonNativeElement.disabled).toBeTruthy();
    });

    it('should augment an existing class with a color property', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      // Expected the mixed-into class to have a color property
      expect(instance.color).toBe('main');

      instance.color = 'cta';

      // Expected the mixed-into class to have an updated color property
      expect(instance.color).toBe('cta');
    });

    it('should add class for default color', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));

      // Expected the element to have the "dt-color-main" class set
      expect(buttonElement.nativeElement.classList).toContain('dt-color-main');
    });

    it('should remove old color classes if new color is set', () => {
      const fixture = createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      instance.color = 'cta';

      // Expected the element to no longer have "dt-color-main" set.
      expect(buttonElement.nativeElement.classList).not.toContain(
        'dt-color-main',
      );
      // Expected the element to have the "dt-color-cta" class set
      expect(buttonElement.nativeElement.classList).toContain('dt-color-cta');
    });

    it('should augment an existing class with a variant property', () => {
      const fixture = createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      // Expected the mixed-into class to have a variant property
      expect(instance.variant).toBe('primary');

      instance.variant = 'secondary';

      // Expected the mixed-into class to have an updated variant property
      expect(instance.variant).toBe('secondary');
    });

    it('should add class for default variant', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));

      // Expected the element to have the "dt-button-primary" class set
      expect(buttonElement.nativeElement.classList).toContain(
        'dt-button-primary',
      );
    });

    it('should remove old variant classes if new variant is set', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;
      instance.variant = 'secondary';

      // Expected the element to no longer have "dt-button-primary" set.
      expect(buttonElement.nativeElement.classList).not.toContain(
        'dt-button-primary',
      );
      // Expected the element to have the "dt-button-secondary" class set
      expect(buttonElement.nativeElement.classList).toContain(
        'dt-button-secondary',
      );
    });

    it('should apply a specific class when button is icon only', () => {
      const fixture = createComponent(IconOnlyButton);
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const anchorElement = fixture.debugElement.query(By.css('a'));

      // Expected the element to have "dt-icon-button" set.
      expect(buttonElement.nativeElement.classList).toContain('dt-icon-button');
      // Expected the element to have "dt-icon-button" set.
      expect(anchorElement.nativeElement.classList).toContain('dt-icon-button');
    });
  });

  // Anchor button tests
  describe('a[dt-button]', () => {
    it('should not redirect if disabled', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();
    });

    it('should add aria-disabled attribute if disabled', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled'),
      ).toBe('false');

      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled'),
      ).toBe('true');
    });

    it('should not add aria-disabled attribute if disabled is false', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));
      fixture.detectChanges();

      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled'),
      ).toBe('false');
      expect(
        buttonDebugElement.nativeElement.getAttribute('disabled'),
      ).toBeNull();

      testComponent.isDisabled = false;
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled'),
      ).toBe('false');
      expect(
        buttonDebugElement.nativeElement.getAttribute('disabled'),
      ).toBeNull();
    });

    it('should remove icon container when icon is removed', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance as TestApp;
      fixture.detectChanges();

      let iconContainer = fixture.debugElement.query(By.css('.dt-button-icon'));

      expect(iconContainer).not.toBeNull();

      testComponent.showIcon = false;
      fixture.detectChanges();
      iconContainer = fixture.debugElement.query(By.css('.dt-button-icon'));

      expect(iconContainer).toBeNull();
    });
  });
});

/** Test component that contains an DtButton. */
@Component({
  selector: 'dt-test-app',
  template: `
    <button
      dt-button
      type="button"
      (click)="increment()"
      [disabled]="isDisabled"
      [variant]="variant"
    >
      <dt-icon name="agent" *ngIf="showIcon"></dt-icon>
      Go
    </button>
    <a href="http://www.dynatrace.com" dt-button [disabled]="isDisabled">
      Link
    </a>
  `,
})
class TestApp {
  clickCount = 0;
  isDisabled = false;
  variant = 'primary';
  showIcon = true;

  increment(): void {
    this.clickCount++;
  }
}

/** Test component that contains an DtButton. */
@Component({
  selector: 'dt-icon-only-button',
  template: `
    <button dt-icon-button type="button">
      <dt-icon name="agent"></dt-icon>
    </button>
    <a href="#" dt-icon-button type="button">
      <dt-icon name="agent"></dt-icon>
    </a>
  `,
})
class IconOnlyButton {}
