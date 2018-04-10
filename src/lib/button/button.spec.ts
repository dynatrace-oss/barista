import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtButtonModule, DtButton } from '@dynatrace/angular-components/button';

describe('DtButton', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtButtonModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  // Regular button tests
  describe('button[dt-button]', () => {
    it('should handle a click on the button', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'));

      buttonDebugElement.nativeElement.click();
      expect(testComponent.clickCount).toBe(1);
    });

    it('should not increment if disabled', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('button'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();

      expect(testComponent.clickCount).toBe(0);
    });

    it('should disable the native button element', () => {
      const fixture = TestBed.createComponent(TestApp);
      const buttonNativeElement = fixture.nativeElement.querySelector('button');
      expect(buttonNativeElement.disabled).toBeFalsy('Expected button not to be disabled');

      fixture.componentInstance.isDisabled = true;
      fixture.detectChanges();
      expect(buttonNativeElement.disabled).toBeTruthy('Expected button to be disabled');
    });

    it('should augment an existing class with a color property', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(instance.color)
        .toBe('main', 'Expected the mixed-into class to have a color property');

      instance.color = 'cta';

      expect(instance.color)
        .toBe('cta', 'Expected the mixed-into class to have an updated color property');
    });

    it('should add class for default color', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(buttonElement.nativeElement.classList)
        .toContain('dt-color-main', 'Expected the element to have the "dt-color-main" class set');
    });

    it('should remove old color classes if new color is set', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      instance.color = 'cta';

      expect(buttonElement.nativeElement.classList)
        .not.toContain('dt-color-main', 'Expected the element to no longer have "dt-color-main" set.');
      expect(buttonElement.nativeElement.classList)
        .toContain('dt-color-cta', 'Expected the element to have the "dt-color-cta" class set');
    });

    it('should augment an existing class with a variant property', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(instance.variant)
        .toBe('primary', 'Expected the mixed-into class to have a variant property');

      instance.variant = 'secondary';

      expect(instance.variant)
        .toBe('secondary', 'Expected the mixed-into class to have an updated variant property');
    });

    it('should add class for default variant', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;

      expect(buttonElement.nativeElement.classList)
        .toContain('dt-button-primary', 'Expected the element to have the "dt-button-primary" class set');
    });

    it('should remove old variant classes if new variant is set', () => {
      const fixture = TestBed.createComponent(TestApp);
      fixture.detectChanges();

      const buttonElement = fixture.debugElement.query(By.css('button'));
      const instance = buttonElement.componentInstance;
      instance.variant = 'secondary';

      expect(buttonElement.nativeElement.classList)
        .not.toContain('dt-button-primary', 'Expected the element to no longer have "dt-button-primary" set.');
      expect(buttonElement.nativeElement.classList)
        .toContain('dt-button-secondary', 'Expected the element to have the "dt-button-secondary" class set');
    });
  });

  // Anchor button tests
  describe('a[dt-button]', () => {
    it('should not redirect if disabled', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));

      testComponent.isDisabled = true;
      fixture.detectChanges();

      buttonDebugElement.nativeElement.click();
    });

    it('should add aria-disabled attribute if disabled', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('false');

      testComponent.isDisabled = true;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled')).toBe('true');
    });

    it('should not add aria-disabled attribute if disabled is false', () => {
      const fixture = TestBed.createComponent(TestApp);
      const testComponent = fixture.debugElement.componentInstance;
      const buttonDebugElement = fixture.debugElement.query(By.css('a'));
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled'))
        .toBe('false', 'Expect aria-disabled="false"');
      expect(buttonDebugElement.nativeElement.getAttribute('disabled'))
        .toBeNull('Expect disabled="false"');

      testComponent.isDisabled = false;
      fixture.detectChanges();
      expect(buttonDebugElement.nativeElement.getAttribute('aria-disabled'))
        .toBe('false', 'Expect no aria-disabled');
      expect(buttonDebugElement.nativeElement.getAttribute('disabled'))
        .toBeNull('Expect no disabled');
    });
  });
});

/** Test component that contains an DtButton. */
@Component({
  selector: 'dt-test-app',
  template: `
    <button dt-button type="button" (click)="increment()"
      [disabled]="isDisabled">
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
  rippleDisabled = false;

  increment(): void {
    this.clickCount++;
  }
}
