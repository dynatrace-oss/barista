// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { async, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtLoadingDistractorModule } from '@dynatrace/angular-components';
import { createComponent } from '../../testing/create-component';

describe('DtLoadingSpinner', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtLoadingDistractorModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should support setting a custom aria-label', fakeAsync(() => {
    const fixture = createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(
      By.css('dt-loading-spinner')
    );
    const instance = spinnerElement.componentInstance;
    instance.ariaLabel = 'Custom Label';
    fixture.detectChanges();
    expect(spinnerElement.nativeElement.getAttribute('aria-label')).toEqual(
      'Custom Label'
    );
  }));

  it('should support setting aria-labeledby', fakeAsync(() => {
    const fixture = createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(
      By.css('dt-loading-spinner')
    );
    const instance = spinnerElement.componentInstance;
    instance.ariaLabelledby = 'test';
    fixture.detectChanges();
    expect(spinnerElement.nativeElement.getAttribute('aria-labeledby')).toEqual(
      'test'
    );
  }));
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-loading-spinner></dt-loading-spinner>
  `,
})
class TestApp {}
