
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtSwitchModule, DtSwitch} from '@dynatrace/angular-components';

describe('DtSwitch', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtSwitchModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtSwitch. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
