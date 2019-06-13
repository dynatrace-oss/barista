// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtBarIndicatorModule } from './index';

describe('DtBarIndicator', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtBarIndicatorModule],
      declarations: [
        BasicBarIndicator,
        ValueBarIndicator,
        ColorBarIndicator,
      ],
    });
  }));

  it('should define a default value of zero for the value attribute', () => {
    const fixture = TestBed.createComponent(BasicBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.componentInstance.value).toBe(0);
  });

  it('should define a default value of zero for the min attribute', () => {
    const fixture = TestBed.createComponent(BasicBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.componentInstance.min).toBe(0);
  });

  it('should define a default value of 100 for the max attribute', () => {
    const fixture = TestBed.createComponent(BasicBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.componentInstance.max).toBe(100);
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const fixture = TestBed.createComponent(BasicBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
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
    const fixture = TestBed.createComponent(ValueBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.componentInstance.value).toBe(150);
    expect(progressElement.componentInstance.min).toBe(100);
    expect(progressElement.componentInstance.max).toBe(200);
  });

  it('should calculate the percentage based on value, min and max', () => {
    const fixture = TestBed.createComponent(ValueBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.componentInstance.percent).toBe(50);
  });

  it('should set the min, max and value aria attribute accordingly', () => {
    const fixture = TestBed.createComponent(ValueBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    expect(progressElement.nativeElement.getAttribute('aria-valuemin')).toBe('100');
    expect(progressElement.nativeElement.getAttribute('aria-valuemax')).toBe('200');
    expect(progressElement.nativeElement.getAttribute('aria-valuenow')).toBe('150');
  });

  it('should augment an existing class with a color property', () => {
    const fixture = TestBed.createComponent(ColorBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    const instance = progressElement.componentInstance;

    expect(instance.color)
      .toBe('main', 'Expected the mixed-into class to have a color property');

    instance.color = 'accent';

    expect(instance.color)
      .toBe('accent', 'Expected the mixed-into class to have an updated color property');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = TestBed.createComponent(ColorBarIndicator);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    const instance = progressElement.componentInstance;

    expect(progressElement.nativeElement.classList)
      .toContain('dt-color-main', 'Expected the element to have the "dt-color-main" class set');

    instance.color = 'accent';

    expect(progressElement.nativeElement.classList).not.toContain(
      'dt-color-main',
      'Expected the element to no longer have "dt-color-main" set.');
    expect(progressElement.nativeElement.classList).toContain(
      'dt-color-accent',
      'Expected the element to have the "dt-color-accent" class set');
  });

  it('should fire valueChange event', () => {
    const spy = jasmine.createSpy();
    const fixture = TestBed.createComponent(ColorBarIndicator);
    const progressElement = fixture.debugElement.query(By.css('dt-bar-indicator'));
    const instance = progressElement.componentInstance;
    instance.valueChange.subscribe(spy);

    instance.value = 80;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ oldValue: 0, newValue: 80 });
  });
});

@Component({template: '<dt-bar-indicator></dt-bar-indicator>'})
class BasicBarIndicator {}

@Component({
  template: '<dt-bar-indicator [value]="value" [min]="min" [max]="max"></dt-bar-indicator>',
})
class ValueBarIndicator {
  value = 150;
  min = 100;
  max = 200;
}

@Component({template: '<dt-bar-indicator [color]="color"></dt-bar-indicator>'})
class ColorBarIndicator {
  color = 'main';
}
