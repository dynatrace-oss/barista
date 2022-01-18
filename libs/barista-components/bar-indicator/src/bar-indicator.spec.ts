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

import { Component } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { createComponent } from '@dynatrace/testing/browser';
import { DtBarIndicatorModule } from './bar-indicator-module';

describe('DtBarIndicator', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtBarIndicatorModule],
        declarations: [BasicBarIndicator, ValueBarIndicator, ColorBarIndicator],
      });
    }),
  );

  it('should define a default value of zero for the value attribute', () => {
    const fixture = createComponent(BasicBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.componentInstance.value).toBe(0);
  });

  it('should define a default value of zero for the min attribute', () => {
    const fixture = createComponent(BasicBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.componentInstance.min).toBe(0);
  });

  it('should define a default value of 100 for the max attribute', () => {
    const fixture = createComponent(BasicBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.componentInstance.max).toBe(100);
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const fixture = createComponent(BasicBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    const progressComponent = progressElement.componentInstance;

    progressComponent.value = 50;
    expect(progressComponent.value).toBe(50);

    progressComponent.value = 0;
    expect(progressComponent.value).toBe(0);

    progressComponent.value = 100;
    expect(progressComponent.value).toBe(100);

    progressComponent.value = 999;
    expect(progressComponent.value).toBe(100);

    progressComponent.value = -10;
    expect(progressComponent.value).toBe(0);
  });

  it('should accept the value, min and max attribute as an input', () => {
    const fixture = createComponent(ValueBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.componentInstance.value).toBe(150);
    expect(progressElement.componentInstance.min).toBe(100);
    expect(progressElement.componentInstance.max).toBe(200);
  });

  it('should calculate the percentage based on value, min and max', () => {
    const fixture = createComponent(ValueBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.componentInstance.percent).toBe(50);
  });

  it('should set the min, max and value aria attribute accordingly', () => {
    const fixture = createComponent(ValueBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    expect(progressElement.nativeElement.getAttribute('aria-valuemin')).toBe(
      '100',
    );
    expect(progressElement.nativeElement.getAttribute('aria-valuemax')).toBe(
      '200',
    );
    expect(progressElement.nativeElement.getAttribute('aria-valuenow')).toBe(
      '150',
    );
  });

  it('should augment an existing class with a color property', () => {
    const fixture = createComponent(ColorBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    const instance = progressElement.componentInstance;

    // Expected the mixed-into class to have a color property
    expect(instance.color).toBe('main');

    instance.color = 'accent';

    // Expected the mixed-into class to have an updated color property
    expect(instance.color).toBe('accent');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = createComponent(ColorBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    const instance = progressElement.componentInstance;

    // Expected the element to have the "dt-color-main" class set
    expect(progressElement.nativeElement.classList).toContain('dt-color-main');

    instance.color = 'accent';

    // Expected the element to no longer have "dt-color-main" set.
    expect(progressElement.nativeElement.classList).not.toContain(
      'dt-color-main',
    );
    // Expected the element to have the "dt-color-accent" class set
    expect(progressElement.nativeElement.classList).toContain(
      'dt-color-accent',
    );
  });

  it('should fire valueChange event', () => {
    const spy = jest.fn();
    const fixture = createComponent(ColorBarIndicator);
    const progressElement = fixture.debugElement.query(
      By.css('dt-bar-indicator'),
    );
    const instance = progressElement.componentInstance;
    instance.valueChange.subscribe(spy);

    instance.value = 80;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ oldValue: 0, newValue: 80 });
  });
});

@Component({ template: '<dt-bar-indicator></dt-bar-indicator>' })
class BasicBarIndicator {}

@Component({
  template:
    '<dt-bar-indicator [value]="value" [min]="min" [max]="max"></dt-bar-indicator>',
})
class ValueBarIndicator {
  value = 150;
  min = 100;
  max = 200;
}

@Component({
  template: '<dt-bar-indicator [color]="color"></dt-bar-indicator>',
})
class ColorBarIndicator {
  color = 'main';
}
