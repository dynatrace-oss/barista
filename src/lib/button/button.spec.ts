// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtButtonModule, DtIconModule } from '@dynatrace/angular-components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponent } from '../../testing/create-component';

describe('DtButton', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtButtonModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations: [TestApp, IconOnlyButton],
    });

    TestBed.compileComponents();
  }));

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
      const buttonNativeElement = fixture.debugElement.nativeElement.querySelector(
        'button'
      );
      expect(buttonNativeElement.disabled).toBeFalsy(
        'Expected button not to be disabled'
      );

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      expect(buttonNativeElement.disabled).toBeTruthy(
        'Expected button to be disabled'
      );
    });

    it('should augment an existing class with a color property', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(instance.color).toBe(
        'main',
        'Expected the mixed-into class to have a color property'
      );

      instance.color = 'cta';

      expect(instance.color).toBe(
        'cta',
        'Expected the mixed-into class to have an updated color property'
      );
    });

    it('should add class for default color', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));

      expect(buttonElement.nativeElement.classList).toContain(
        'dt-color-main',
        'Expected the element to have the "dt-color-main" class set'
      );
    });

    it('should remove old color classes if new color is set', () => {
      const fixture = createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      instance.color = 'cta';

      expect(buttonElement.nativeElement.classList).not.toContain(
        'dt-color-main',
        'Expected the element to no longer have "dt-color-main" set.'
      );
      expect(buttonElement.nativeElement.classList).toContain(
        'dt-color-cta',
        'Expected the element to have the "dt-color-cta" class set'
      );
    });

    it('should augment an existing class with a variant property', () => {
      const fixture = createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(instance.variant).toBe(
        'primary',
        'Expected the mixed-into class to have a variant property'
      );

      instance.variant = 'secondary';

      expect(instance.variant).toBe(
        'secondary',
        'Expected the mixed-into class to have an updated variant property'
      );
    });

    it('should add class for default variant', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));

      expect(buttonElement.nativeElement.classList).toContain(
        'dt-button-primary',
        'Expected the element to have the "dt-button-primary" class set'
      );
    });

    it('should remove old variant classes if new variant is set', () => {
      const fixture = createComponent(TestApp);
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;
      instance.variant = 'secondary';

      expect(buttonElement.nativeElement.classList).not.toContain(
        'dt-button-primary',
        'Expected the element to no longer have "dt-button-primary" set.'
      );
      expect(buttonElement.nativeElement.classList).toContain(
        'dt-button-secondary',
        'Expected the element to have the "dt-button-secondary" class set'
      );
    });

    it('should apply a specific class when button is icon only', () => {
      const fixture = createComponent(IconOnlyButton);
      fixture.detectChanges();
      const buttonElement = fixture.debugElement.query(By.css('button'));
      const anchorElement = fixture.debugElement.query(By.css('a'));

      expect(buttonElement.nativeElement.classList).toContain(
        'dt-icon-button',
        'Expected the element to have "dt-icon-button" set.'
      );
      expect(anchorElement.nativeElement.classList).toContain(
        'dt-icon-button',
        'Expected the element to have "dt-icon-button" set.'
      );
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
        buttonDebugElement.nativeElement.getAttribute('aria-disabled')
      ).toBe('false');

      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled')
      ).toBe('true');
    });

    it('should not add aria-disabled attribute if disabled is false', () => {
      const fixture = createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled')
      ).toBe('false', 'Expect aria-disabled="false"');
      expect(
        buttonDebugElement.nativeElement.getAttribute('disabled')
      ).toBeNull('Expect disabled="false"');

      testComponent.isDisabled = false;
      fixture.detectChanges();
      expect(
        buttonDebugElement.nativeElement.getAttribute('aria-disabled')
      ).toBe('false', 'Expect no aria-disabled');
      expect(
        buttonDebugElement.nativeElement.getAttribute('disabled')
      ).toBeNull('Expect no disabled');
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
    <button dt-icon-button type="button"
      ><dt-icon name="agent"></dt-icon
    ></button>
    <a href="#" dt-icon-button type="button"
      ><dt-icon name="agent"></dt-icon
    ></a>
  `,
})
class IconOnlyButton {}
