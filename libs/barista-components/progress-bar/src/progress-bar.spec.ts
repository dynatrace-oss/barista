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
import { DtProgressBarModule } from './progress-bar-module';

describe('DtProgressBar', () => {
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtProgressBarModule],
        declarations: [
          BasicProgressBar,
          ValueProgressBar,
          ColorProgressBar,
          DescriptionProgressBar,
          CountProgressBar,
          DescriptionAndCountProgressBar,
        ],
      });
    }),
  );

  it('should define a default value of zero for the value attribute', () => {
    const fixture = createComponent(BasicProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    expect(progressElement.componentInstance.value).toBe(0);
  });

  it('should define a default value of zero for the min attribute', () => {
    const fixture = createComponent(BasicProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    expect(progressElement.componentInstance.min).toBe(0);
  });

  it('should define a default value of 100 for the max attribute', () => {
    const fixture = createComponent(BasicProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    expect(progressElement.componentInstance.max).toBe(100);
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const fixture = createComponent(BasicProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
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
    const fixture = createComponent(ValueProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    expect(progressElement.componentInstance.value).toBe(150);
    expect(progressElement.componentInstance.min).toBe(100);
    expect(progressElement.componentInstance.max).toBe(200);
  });

  it('should calculate the percentage based on value, min and max', () => {
    const fixture = createComponent(ValueProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    expect(progressElement.componentInstance.percent).toBe(50);
  });

  it('should set the min, max and value aria attribute accordingly', () => {
    const fixture = createComponent(ValueProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
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
    const fixture = createComponent(ColorProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    const instance = progressElement.componentInstance;

    expect(instance.color).toBe('main');

    instance.color = 'accent';

    expect(instance.color).toBe('accent');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = createComponent(ColorProgressBar);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    const instance = progressElement.componentInstance;

    expect(progressElement.nativeElement.classList).toContain('dt-color-main');

    instance.color = 'accent';

    expect(progressElement.nativeElement.classList).not.toContain(
      'dt-color-main',
    );
    expect(progressElement.nativeElement.classList).toContain(
      'dt-color-accent',
    );
  });

  it('should fire valueChange event', () => {
    const spy = jest.fn();
    const fixture = TestBed.createComponent(ColorProgressBar);
    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-bar'),
    );
    const instance = progressElement.componentInstance;
    instance.valueChange.subscribe(spy);

    instance.value = 80;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ oldValue: 0, newValue: 80 });
  });

  it('should render a description when defined', () => {
    const fixture = createComponent(DescriptionProgressBar);

    const descriptionElement = fixture.debugElement.query(
      By.css('dt-progress-bar-description'),
    );
    expect(descriptionElement).toBeDefined();
  });

  it('should render a count when defined', () => {
    const fixture = createComponent(CountProgressBar);

    const countElement = fixture.debugElement.query(
      By.css('dt-progress-bar-count'),
    );
    expect(countElement).toBeDefined();
  });

  it('should render a description and count when defined', () => {
    const fixture = createComponent(DescriptionAndCountProgressBar);

    const descriptionElement = fixture.debugElement.query(
      By.css('dt-progress-bar-count'),
    );
    const countElement = fixture.debugElement.query(
      By.css('dt-progress-bar-count'),
    );
    expect(descriptionElement).toBeDefined();
    expect(countElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a description is set', () => {
    const fixture = createComponent(DescriptionProgressBar);

    const wrapperElement = fixture.debugElement.query(
      By.css('dt-progress-bar-descriptionwrapper'),
    );
    expect(wrapperElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a count is set', () => {
    const fixture = createComponent(CountProgressBar);

    const wrapperElement = fixture.debugElement.query(
      By.css('dt-progress-bar-descriptionwrapper'),
    );
    expect(wrapperElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a description and count are set', () => {
    const fixture = createComponent(DescriptionAndCountProgressBar);

    const wrapperElement = fixture.debugElement.query(
      By.css('dt-progress-bar-descriptionwrapper'),
    );
    expect(wrapperElement).toBeDefined();
  });
});

@Component({ template: '<dt-progress-bar></dt-progress-bar>' })
class BasicProgressBar {}

@Component({
  template:
    '<dt-progress-bar [value]="value" [min]="min" [max]="max"></dt-progress-bar>',
})
class ValueProgressBar {
  value = 150;
  min = 100;
  max = 200;
}

@Component({ template: '<dt-progress-bar [color]="color"></dt-progress-bar>' })
class ColorProgressBar {
  color = 'main';
}

@Component({
  template: `
    <dt-progress-bar [value]="75">
      <dt-progress-bar-description>
        We found more than 100 results.
      </dt-progress-bar-description>
    </dt-progress-bar>
  `,
})
class DescriptionProgressBar {}

@Component({
  template: `
    <dt-progress-bar [value]="75">
      <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
    </dt-progress-bar>
  `,
})
class CountProgressBar {}

@Component({
  template: `
    <dt-progress-bar [value]="75">
      <dt-progress-bar-description>
        We found more than 100 results.
      </dt-progress-bar-description>
      <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
    </dt-progress-bar>
  `,
})
class DescriptionAndCountProgressBar {}
