// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { TestBed, async } from '@angular/core/testing';
import { DtTileModule } from '@dynatrace/angular-components';
import { By } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { createComponent } from '../../testing/create-component';

describe('DtTile', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTileModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));
  it('should handle a click on the tile', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('dt-tile'));

    tileDebugElement.nativeElement.click();
    expect(testComponent.clickCount).toBe(1);
  });

  // TODO @thomaspink: investigate this; .click() triggers even if we call preventDefault()
  // it('should not increment if disabled', () => {
  //   const fixture = TestBed.createComponent(TestApp);
  //   const testComponent = fixture.debugElement.componentInstance;
  //   const tileDebugElement = fixture.debugElement.query(By.css('dt-tile'));

  //   testComponent.isDisabled = true;
  //   fixture.detectChanges();

  //   tileDebugElement.nativeElement.click();

  //   expect(testComponent.clickCount).toBe(0);
  // });

  it('should add a disabled class to the tile element', () => {
    const fixture = createComponent(TestApp);
    const tileNativeElement = fixture.debugElement.nativeElement.querySelector(
      'dt-tile',
    );
    expect(tileNativeElement.classList.contains('dt-tile-disabled')).toBeFalsy(
      'Expected tile not to be disabled',
    );

    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    expect(tileNativeElement.classList.contains('dt-tile-disabled')).toBeTruthy(
      'Expected tile to be disabled',
    );
  });

  it('should add aria-disabled attribute if disabled', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('dt-tile'));
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe(
      'false',
    );

    testComponent.isDisabled = true;
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe(
      'true',
    );
  });

  it('should not add aria-disabled attribute if disabled is false', () => {
    const fixture = createComponent(TestApp);
    const testComponent = fixture.debugElement.componentInstance;
    const tileDebugElement = fixture.debugElement.query(By.css('dt-tile'));
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe(
      'false',
      'Expect aria-disabled="false"',
    );
    expect(tileDebugElement.nativeElement.getAttribute('disabled')).toBeNull(
      'Expect disabled="false"',
    );

    testComponent.isDisabled = false;
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe(
      'false',
      'Expect no aria-disabled',
    );
    expect(tileDebugElement.nativeElement.getAttribute('disabled')).toBeNull(
      'Expect no disabled',
    );
  });

  it('should augment an existing class with a color property', () => {
    const fixture = createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('dt-tile'));
    const instance = tileElement.componentInstance;

    expect(instance.color).toBe(
      'main',
      'Expected the mixed-into class to have a color property',
    );

    instance.color = 'error';

    expect(instance.color).toBe(
      'error',
      'Expected the mixed-into class to have an updated color property',
    );
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('dt-tile'));
    const instance = tileElement.componentInstance;

    expect(tileElement.nativeElement.classList).toContain(
      'dt-color-main',
      'Expected the element to have the "dt-color-main" class set',
    );

    instance.color = 'error';

    expect(tileElement.nativeElement.classList).not.toContain(
      'dt-color-main',
      'Expected the element to no longer have "dt-color-main" set.',
    );
    expect(tileElement.nativeElement.classList).toContain(
      'dt-color-error',
      'Expected the element to have the "dt-color-error" class set',
    );
  });
});

/** Test component that contains an DtTile. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-tile color="main" (click)="increment()" [disabled]="isDisabled">
      <dt-tile-icon></dt-tile-icon>
      <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
      <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
      Network traffic
    </dt-tile>
  `,
})
class TestApp {
  clickCount = 0;
  isDisabled = false;

  increment(): void {
    this.clickCount++;
  }
}
