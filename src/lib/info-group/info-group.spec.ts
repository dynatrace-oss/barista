
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtInfoGroupModule, DtInfoGroup} from '@dynatrace/angular-components';

describe('DtInfoGroup', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtInfoGroupModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtInfoGroup. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
