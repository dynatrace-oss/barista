
import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtProgressBarModule} from './index';

describe('DtProgressBar', () => {
  beforeEach(async(() => {
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
  }));

  it('should define a default value of zero for the value attribute', () => {
    const fixture = TestBed.createComponent(BasicProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.componentInstance.value).toBe(0);
  });

  it('should define a default value of zero for the min attribute', () => {
    const fixture = TestBed.createComponent(BasicProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.componentInstance.min).toBe(0);
  });

  it('should define a default value of 100 for the max attribute', () => {
    const fixture = TestBed.createComponent(BasicProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.componentInstance.max).toBe(100);
  });

  it('should clamp the value of the progress between 0 and 100', () => {
    const fixture = TestBed.createComponent(BasicProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
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
    const fixture = TestBed.createComponent(ValueProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.componentInstance.value).toBe(150);
    expect(progressElement.componentInstance.min).toBe(100);
    expect(progressElement.componentInstance.max).toBe(200);
  });

  it('should calculate the percentage based on value, min and max', () => {
    const fixture = TestBed.createComponent(ValueProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.componentInstance.percent).toBe(50);
  });

  it('should set the min, max and value aria attribute accordingly', () => {
    const fixture = TestBed.createComponent(ValueProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    expect(progressElement.nativeElement.getAttribute('aria-valuemin')).toBe('100');
    expect(progressElement.nativeElement.getAttribute('aria-valuemax')).toBe('200');
    expect(progressElement.nativeElement.getAttribute('aria-valuenow')).toBe('150');
  });

  it('should augment an existing class with a color property', () => {
    const fixture = TestBed.createComponent(ColorProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    const instance = progressElement.componentInstance;

    expect(instance.color)
      .toBe('main', 'Expected the mixed-into class to have a color property');

    instance.color = 'accent';

    expect(instance.color)
      .toBe('accent', 'Expected the mixed-into class to have an updated color property');
  });

  it('should remove old color classes if new color is set', () => {
    const fixture = TestBed.createComponent(ColorProgressBar);
    fixture.detectChanges();

    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
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
    const fixture = TestBed.createComponent(ColorProgressBar);
    const progressElement = fixture.debugElement.query(By.css('dt-progress-bar'));
    const instance = progressElement.componentInstance;
    instance.valueChange.subscribe(spy);

    instance.value = 80;
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith({ oldValue: 0, newValue: 80 });
  });

  it('should render a description when defined', () => {
    const fixture = TestBed.createComponent(DescriptionProgressBar);
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(By.css('dt-progress-bar-description'));
    expect(descriptionElement).toBeDefined();
  });

  it('should render a count when defined', () => {
    const fixture = TestBed.createComponent(CountProgressBar);
    fixture.detectChanges();

    const countElement = fixture.debugElement.query(By.css('dt-progress-bar-count'));
    expect(countElement).toBeDefined();
  });

  it('should render a description and count when defined', () => {
    const fixture = TestBed.createComponent(DescriptionAndCountProgressBar);
    fixture.detectChanges();

    const descriptionElement = fixture.debugElement.query(By.css('dt-progress-bar-count'));
    const countElement = fixture.debugElement.query(By.css('dt-progress-bar-count'));
    expect(descriptionElement).toBeDefined();
    expect(countElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a description is set', () => {
    const fixture = TestBed.createComponent(DescriptionProgressBar);
    fixture.detectChanges();

    const wrapperElement = fixture.debugElement.query(By.css('dt-progress-bar-descriptionwrapper'));
    expect(wrapperElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a count is set', () => {
    const fixture = TestBed.createComponent(CountProgressBar);
    fixture.detectChanges();

    const wrapperElement = fixture.debugElement.query(By.css('dt-progress-bar-descriptionwrapper'));
    expect(wrapperElement).toBeDefined();
  });

  it('should add the wrapper class to the wrapping element if a description and count are set', () => {
    const fixture = TestBed.createComponent(DescriptionAndCountProgressBar);
    fixture.detectChanges();

    const wrapperElement = fixture.debugElement.query(By.css('dt-progress-bar-descriptionwrapper'));
    expect(wrapperElement).toBeDefined();
  });
});

@Component({template: '<dt-progress-bar></dt-progress-bar>'})
class BasicProgressBar {}

@Component({
  template: '<dt-progress-bar [value]="value" [min]="min" [max]="max"></dt-progress-bar>',
})
class ValueProgressBar {
  value = 150;
  min = 100;
  max = 200;
}

@Component({template: '<dt-progress-bar [color]="color"></dt-progress-bar>'})
class ColorProgressBar {
  color = 'main';
}

@Component({
  template: `
  <dt-progress-bar [value]="75">
  <dt-progress-bar-description>We found more than 100 results.</dt-progress-bar-description>
  </dt-progress-bar>`,
})
class DescriptionProgressBar { }

@Component({
  template: `
  <dt-progress-bar [value]="75">
  <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
  </dt-progress-bar>`,
})
class CountProgressBar { }

@Component({
  template: `
  <dt-progress-bar [value]="75">
  <dt-progress-bar-description>We found more than 100 results.</dt-progress-bar-description>
  <dt-progress-bar-count>80/100 days</dt-progress-bar-count>
  </dt-progress-bar>`,
})
class DescriptionAndCountProgressBar { }
