// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtProgressCircleModule } from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

describe('DtProgressCircle', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtProgressCircleModule],
      declarations: [
        BasicProgressCircle,
        ValueProgressCircle,
        ColorProgressCircle,
      ],
    });
  }));

  it('should define a default value of zero for the value attribute', () => {
    const fixture = createComponent(BasicProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance.value).toBe(0);
  });

  it('should define a default value of zero for the min attribute', () => {
    const fixture = createComponent(BasicProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance.min).toBe(0);
  });

  it('should define a default value of 100 for the max attribute', () => {
    const fixture = createComponent(BasicProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance.max).toBe(100);
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const fixture = createComponent(BasicProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
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
    const fixture = createComponent(ValueProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance.value).toBe(150);
    expect(progressElement.componentInstance.min).toBe(100);
    expect(progressElement.componentInstance.max).toBe(200);
  });

  it('should calculate the percentage based on value, min and max', () => {
    const fixture = createComponent(ValueProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance.percent).toBe(50);
  });

  it('should calculate the dash offset based the percentage', () => {
    const fixture = createComponent(ValueProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    expect(progressElement.componentInstance._dashOffset).toBe(164);
  });

  it('should set the min, max and value aria attribute accordingly', () => {
    const fixture = createComponent(ValueProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
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
    const fixture = createComponent(ColorProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    const instance = progressElement.componentInstance;

    expect(instance.color).toBe('main');

    instance.color = 'accent';

    expect(instance.color).toBe('accent');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = createComponent(ColorProgressCircle);

    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
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
    const fixture = createComponent(ColorProgressCircle);
    const progressElement = fixture.debugElement.query(
      By.css('dt-progress-circle'),
    );
    const instance = progressElement.componentInstance;
    instance.valueChange.subscribe(spy);

    instance.value = 80;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ oldValue: 0, newValue: 80 });
  });
});

@Component({ template: '<dt-progress-circle></dt-progress-circle>' })
class BasicProgressCircle {}

@Component({
  template:
    '<dt-progress-circle [value]="value" [min]="min" [max]="max"></dt-progress-circle>',
})
class ValueProgressCircle {
  value = 150;
  min = 100;
  max = 200;
}

@Component({
  template: '<dt-progress-circle [color]="color"></dt-progress-circle>',
})
class ColorProgressCircle {
  color = 'main';
}
