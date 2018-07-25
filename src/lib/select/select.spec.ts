
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtSelectModule, DtSelect} from '@dynatrace/angular-components';

describe('DtSelect', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtSelectModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtSelect. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
