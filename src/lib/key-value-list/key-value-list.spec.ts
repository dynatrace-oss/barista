
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {By} from '@angular/platform-browser';
import {DtKeyValueListModule, DtKeyValueList, DtKeyValueListItem} from '@dynatrace/angular-components';

describe('DtKeyValueList', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtKeyValueListModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtKeyValueList. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}
