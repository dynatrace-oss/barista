
import { async, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { DtTabsModule, DtTabGroup } from '@dynatrace/angular-components';

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
  <dt-tab-group>
  <dt-tab disabled>
    <ng-template dtTabLabel>Physical <em>CPU</em></ng-template>
    <ng-template dtTabContent>
      <h1>pu-ready-time-recovered</h1>
      <button dt-button>initialize</button>
      <input type="text" value="some">
    </ng-template>
  </dt-tab>
  <dt-tab>
    <ng-template dtTabLabel>CPU ready time</ng-template>
    <ng-template dtTabContent>
      <h1>CPU-ready-time</h1>
      <button dt-button>initialize</button>
    </ng-template>
  </dt-tab>
</dt-tab-group>
  `,
})
class TestApp {

}

/**
 * color on the button to be correct also check class
 */

/**
 * throw error if no tab is active (e.g. all are disabled) initially
 */

/**
 * throw error if no tab is active (e.g. all are disabled) at runtime
 */

/**
 * throw error if only one tab is inside the tabgroup initially
 */

/**
 * throw error if only one tab is inside the tabgroup at runtime
 */

/**
 * first one is selected if none is selected
 */

/**
 * selected works if set
 */

/**
 * if selected tab is removed at runtime first one is selected
 */

/**
 * check lazy loading
 */
