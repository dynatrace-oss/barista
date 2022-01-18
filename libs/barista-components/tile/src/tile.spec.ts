/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtTileModule } from './tile-module';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtTile', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtTileModule],
        declarations: [TestApp],
      });

      TestBed.compileComponents();
    }),
  );
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
    const tileNativeElement =
      fixture.debugElement.nativeElement.querySelector('dt-tile');
    expect(
      tileNativeElement.classList.contains('dt-tile-disabled'),
    ).toBeFalsy();

    fixture.componentInstance.isDisabled = true;
    fixture.detectChanges();
    expect(
      tileNativeElement.classList.contains('dt-tile-disabled'),
    ).toBeTruthy();
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
    );
    expect(tileDebugElement.nativeElement.getAttribute('disabled')).toBeNull();

    testComponent.isDisabled = false;
    fixture.detectChanges();
    expect(tileDebugElement.nativeElement.getAttribute('aria-disabled')).toBe(
      'false',
    );
    expect(tileDebugElement.nativeElement.getAttribute('disabled')).toBeNull();
  });

  it('should augment an existing class with a color property', () => {
    const fixture = createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('dt-tile'));
    const instance = tileElement.componentInstance;

    expect(instance.color).toBe('main');

    instance.color = 'error';

    expect(instance.color).toBe('error');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = createComponent(TestApp);
    fixture.detectChanges();

    const tileElement = fixture.debugElement.query(By.css('dt-tile'));
    const instance = tileElement.componentInstance;

    expect(tileElement.nativeElement.classList).toContain('dt-color-main');

    instance.color = 'error';

    expect(tileElement.nativeElement.classList).not.toContain('dt-color-main');
    expect(tileElement.nativeElement.classList).toContain('dt-color-error');
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
