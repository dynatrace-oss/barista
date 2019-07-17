// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import {
  DtTimelineChartModule,
  DtTimelineChart,
} from '@dynatrace/angular-components';

describe('DtTimelineChart', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTimelineChartModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  /**
   * insert your tests here
   */
});

/** Test component that contains an DtTimelineChart. */
@Component({
  selector: 'dt-test-app',
  template: `
    <!-- insert your component testapp usage here -->
  `,
})
class TestApp {}
