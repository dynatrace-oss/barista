// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';

import { DtEventChartModule } from '@dynatrace/angular-components/event-chart';

describe('DtEventChart', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtEventChartModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  it('dummy', () => {
    expect(true).toBeTruthy();
  });

  /**
   * insert your tests here
   */
});

/** Test component that contains an DtEventChart. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-event-chart></dt-event-chart>
  `,
})
class TestApp {}
