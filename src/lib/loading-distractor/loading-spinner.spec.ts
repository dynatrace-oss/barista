import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtLoadingDistractorModule, DtLoadingSpinner } from '@dynatrace/angular-components/loading-distractor';

describe('DtLoadingSpinner', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtLoadingDistractorModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should support setting a custom aria-label', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(By.css('dt-loading-spinner'));
    const instance = spinnerElement.componentInstance;
    instance.ariaLabel = 'Custom Label';
    fixture.detectChanges();
    expect(spinnerElement.nativeElement.getAttribute('aria-label')).toEqual('Custom Label');
  }));

  it('should support setting aria-labeledby', fakeAsync(() => {
    const fixture = TestBed.createComponent(TestApp);
    const spinnerElement = fixture.debugElement.query(By.css('dt-loading-spinner'));
    const instance = spinnerElement.componentInstance;
    instance.ariaLabelledby = 'test';
    fixture.detectChanges();
    expect(spinnerElement.nativeElement.getAttribute('aria-labeledby')).toEqual('test');
  }));
});

@Component({
  selector: 'dt-test-app',
  template: `<dt-loading-spinner></dt-loading-spinner>`,
})
class TestApp { }
