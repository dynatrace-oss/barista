
import {async, TestBed} from '@angular/core/testing';
import {Component} from '@angular/core';
import {DtTabsModule, DtTabGroup} from '@dynatrace/angular-components';

describe('DtTabs', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTabsModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

  /** Test component that contains an DtTabs. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {

}

/**
 * color on the button to be correct
 */

 /**
  * throw error if no tab is active (e.g. all are disabled)
  */

  /**
   * throw error if only one tab is inside the tabgroup
   */

  
