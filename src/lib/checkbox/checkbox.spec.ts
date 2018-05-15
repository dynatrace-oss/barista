
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtCheckboxModule, DtCheckbox} from '@dynatrace/angular-components';

describe('DtCheckbox', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtCheckboxModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtCheckbox. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
