
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

  it('expects ', () => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();

    const tileNativeElement = fixture.debugElement.nativeElement.querySelector('dt-alert');
    expect(tileNativeElement.classList.contains('dt-alert-error'))
      .toBeTruthy('css class to be present');

    let groupDebugElement = fixture.debugElement.query(By.directive(DtAlert));
    let groupInstance = groupDebugElement.injector.get<DtAlert>(DtAlert);

    groupInstance.severity = 'warning';
    fixture.detectChanges();

    expect(tileNativeElement.classList.contains('dt-alert-warning'))
      .toBeTruthy('new css class to be present after change');

    expect(tileNativeElement.classList.contains('dt-alert-error'))
      .toBeFalsy('previous css class to not be present after change');

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
