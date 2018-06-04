
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtProgressCircleModule, DtProgressCircle} from '@dynatrace/angular-components';

describe('DtProgressCircle', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtProgressCircleModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtProgressCircle. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
