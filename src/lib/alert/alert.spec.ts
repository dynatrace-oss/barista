
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtAlertModule, DtAlert} from '@dynatrace/angular-components';

describe('DtAlert', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtAlertModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('should add classes', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-alert');
    expect(tileNativeElement.classList.contains('error'))
      .toBeTruthy('Expected alert to have css style');

    let groupDebugElement = fixture.debugElement.query(By.directive(DtAlert));
    let groupInstance = groupDebugElement.injector.get<DtAlert>(DtAlert);

    groupInstance.severity = 'warning';
    fixture.detectChanges();

    expect(tileNativeElement.classList.contains('warning'))
      .toBeTruthy('Expected alert to have css style');

    expect(tileNativeElement.classList.contains('error'))
      .toBeFalsy('Expected alert to not have css style');

  });
});

  /** Test component that contains an DtAlert. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-alert severity="error"></dt-alert>
  `,
})
class TestApp {

}
