/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { ENTER } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement, Provider, Type } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  flush,
  inject,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DtChartModule } from '../chart-module';
// We have to import from the file directly as barrel files only expose getters no setters.
// To mock the specific function of the file we have to import the file and disable the
// module boundaries linting rule.
// eslint-disable-next-line
import * as formatters from '../../../formatters/src/date/date-range';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import {
  dispatchKeyboardEvent,
  dispatchMouseEvent,
} from '@dynatrace/testing/browser';
import { Subject } from 'rxjs';
import { ARIA_DEFAULT_CLOSE_LABEL } from '../range/constants';
import { DtChartRange } from '../range/range';
import * as streams from './streams';
import type { Options, SeriesOptionsType } from 'highcharts';

jest
  .spyOn(formatters, 'dtFormatDateRange')
  .mockImplementation(() => '21 Feb 2019');

describe('DtChart Selection Area', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  function createComponent<T>(
    component: Type<T>,
    providers: Provider[] = [],
  ): ComponentFixture<T> {
    TestBed.configureTestingModule({
      imports: [
        DtChartModule,
        DtThemingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        HttpClientTestingModule,
        NoopAnimationsModule,
      ],
      declarations: [
        TestChart,
        TestChartComponent,
        TimestampOnlyChart,
        RangeOnlyChart,
      ],
      providers,
    });

    TestBed.compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();

    return TestBed.createComponent<T>(component);
  }

  afterEach(inject(
    [OverlayContainer],
    (currentOverlayContainer: OverlayContainer) => {
      // Since we're resetting the testing module in some of the tests,
      // we can potentially have multiple overlay containers.
      currentOverlayContainer.ngOnDestroy();
      overlayContainer.ngOnDestroy();
    },
  ));

  describe('range and timestamp available', () => {
    let fixture: ComponentFixture<TestChart>;

    beforeEach(() => {
      fixture = createComponent(TestChart);
    });

    it('should not have a selection area if there is no timestamp or range inside the chart', () => {
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area'),
      );

      expect(selectionArea).toBeNull();
    });

    it('should have a timestamp inside the chart selection area', () => {
      fixture.componentInstance.hasTimestamp = true;
      fixture.detectChanges();
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area'),
      );
      const timestamp = fixture.debugElement.query(
        By.css('.dt-chart-timestamp'),
      );

      expect(selectionArea).not.toBeNull();
      expect(timestamp).not.toBeNull();
    });

    it('should have a range inside the chart selection area', () => {
      fixture.componentInstance.hasRange = true;
      fixture.detectChanges();
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area'),
      );
      const range = fixture.debugElement.query(By.css('.dt-chart-range'));

      expect(selectionArea).not.toBeNull();
      expect(range).not.toBeNull();
    });
  });

  describe('hairline', () => {
    let fixture: ComponentFixture<TestChartComponent>;
    let hairline: DebugElement;
    let plotBackground: Element;

    const fakedMouseOut$ = new Subject<any>();

    beforeEach(() => {
      jest.spyOn(streams, 'getMouseOutStream').mockReturnValue(fakedMouseOut$);

      fixture = createComponent(TestChartComponent);
      fixture.detectChanges();

      hairline = fixture.debugElement.query(By.css('.dt-chart-hairline'));
      plotBackground = fixture.debugElement.nativeElement.querySelector(
        '.highcharts-plot-background',
      );
    });

    // eslint-disable-next-line
    it.skip('should have a hairline that should be visible on mousemove', () => {
      expect(hairline.nativeElement).toBeDefined();
      // initial display none is from styles
      // TODO: [e2e] getCpmputedStyle is not available in jsdom
      expect(getComputedStyle(hairline.nativeElement).display).toBe('none');

      // dispatch mousemove on plotBackground
      dispatchMouseEvent(plotBackground, 'mousemove', 100, 100);

      expect(hairline.styles.display).toBe('inherit');
      expect(hairline.styles.transform).toMatch(/translateX\(.+px\)/);
    });

    // eslint-disable-next-line
    it.skip('should hide the hairline on mouseout', () => {
      // TODO: [e2e] getCpmputedStyle is not available in jsdom
      expect(getComputedStyle(hairline.nativeElement).display).toBe('none');

      dispatchMouseEvent(plotBackground, 'mousemove', 50, 50);
      // mouse move over the bounding client rect.
      expect(hairline.styles.display).toBe('inherit');

      fakedMouseOut$.next({ x: 100, y: 100 });
      // now outside the mocked area of the bounding client rect.
      expect(hairline.styles.display).toBe('none');
    });
  });

  describe('accessibility', () => {
    let fixture: ComponentFixture<TestChart>;
    let range: DtChartRange;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(TestChart);

      fixture.componentInstance.hasRange = true;
      fixture.detectChanges();
      range = fixture.debugElement.query(
        By.css('.dt-chart-range'),
      ).componentInstance;
      const start = new Date('2019/06/01 20:40:00').getTime();
      const end = new Date('2019/06/01 20:55:00').getTime();
      range.value = [start, end];

      range._stateChanges.next({} as any);
      fixture.detectChanges();
      flush();
    }));

    describe('range', () => {
      it('should have a default aria label on the overlay close button', fakeAsync(() => {
        flush();
        const container = overlayContainerElement.querySelector(
          '.dt-chart-selection-area-overlay .dt-icon-button',
        ) as HTMLElement;

        expect(container.getAttribute('aria-label')).toBe(
          ARIA_DEFAULT_CLOSE_LABEL,
        );
      }));

      it('should not have been focused on programmatic creation', () => {
        const rangeContainer = fixture.debugElement.query(
          By.css('.dt-chart-range-container'),
        );
        expect(document.activeElement).not.toEqual(
          rangeContainer.nativeElement,
        );
      });

      it('should focused on programmatic focus call', () => {
        range.focus();
        const rangeContainer = fixture.debugElement.query(
          By.css('.dt-chart-range-container'),
        );
        expect(document.activeElement).toEqual(rangeContainer.nativeElement);
      });
    });
  });

  describe('keyboard support', () => {
    function createFixture<T>(
      component: Type<T>,
      selector: string,
    ): {
      fixture: ComponentFixture<T>;
      selectionArea: HTMLElement;
      element: DebugElement;
    } {
      const fixture = createComponent(component);
      fixture.detectChanges();
      const selectionArea = fixture.debugElement.query(
        By.css('.dt-chart-selection-area'),
      );

      Object.defineProperty(
        selectionArea.componentInstance,
        '_selectionAreaBcr',
        {
          get: jest.fn().mockReturnValue({
            top: 10,
            left: 10,
            right: 510,
            bottom: 110,
            width: 500,
            height: 100,
          }),
        },
      );

      const element: DebugElement = fixture.debugElement.query(
        By.css(selector),
      );

      return {
        fixture,
        selectionArea: selectionArea.nativeElement,
        element,
      };
    }

    it('should create a timestamp on hitting the enter key', () => {
      const selector = '.dt-chart-timestamp-selector';
      const { fixture, selectionArea, element } = createFixture(
        TimestampOnlyChart,
        selector,
      );
      expect(element).toBeNull();

      dispatchKeyboardEvent(selectionArea, 'keydown', ENTER);
      fixture.detectChanges();

      const timestamp = fixture.debugElement.query(By.css(selector));

      expect(timestamp).not.toBeNull();
      expect(timestamp.nativeElement).toBeDefined();
    });

    it('should create a range on hitting the enter key with a range only selection area', () => {
      const selector = '.dt-chart-range-container';
      const { fixture, selectionArea, element } = createFixture(
        RangeOnlyChart,
        selector,
      );
      expect(element).toBeNull();

      dispatchKeyboardEvent(selectionArea, 'keydown', ENTER);
      fixture.detectChanges();

      const range = fixture.debugElement.query(By.css(selector));

      expect(range).not.toBeNull();
      expect(range.nativeElement).toBeDefined();
    });
  });
});

@Component({
  selector: 'test-chart-without-selection-area',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-range *ngIf="hasRange"></dt-chart-range>
      <dt-chart-timestamp *ngIf="hasTimestamp"></dt-chart-timestamp>
    </dt-chart>
  `,
})
export class TestChart {
  options = OPTIONS;
  series = SERIES;

  hasRange = false;
  hasTimestamp = false;
}

@Component({
  selector: 'test-chart',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-timestamp></dt-chart-timestamp>
      <dt-chart-range
        value="[1370304002000, 1370304005000]"
        ariaLabelClose="CLOSE"
      ></dt-chart-range>
    </dt-chart>
  `,
})
export class TestChartComponent {
  options = OPTIONS;
  series = SERIES;
}

@Component({
  selector: 'test-chart',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-timestamp></dt-chart-timestamp>
    </dt-chart>
  `,
})
export class TimestampOnlyChart {
  options = OPTIONS;
  series = SERIES;
}

@Component({
  selector: 'test-chart',
  template: `
    <dt-chart [options]="options" [series]="series">
      <dt-chart-range></dt-chart-range>
    </dt-chart>
  `,
})
export class RangeOnlyChart {
  options = OPTIONS;
  series = SERIES;
}

const OPTIONS: Options = {
  xAxis: {
    type: 'datetime',
  },
  yAxis: [
    {
      labels: {
        format: '{value}',
      },
      tickInterval: 10,
    },
    {
      labels: {
        format: '{value}/min',
      },
      opposite: true,
      tickInterval: 50,
    },
  ],
  plotOptions: {
    column: {
      stacking: 'normal',
    },
    series: {
      marker: {
        enabled: false,
      },
    },
  },
};

const SERIES: SeriesOptionsType[] = [
  {
    name: 'Requests',
    type: 'column',
    yAxis: 1,
    data: generateData(
      40,
      0,
      250,
      new Date('2019/06/01 20:38:00').getTime(),
      900000,
    ),
  },
];

function randomize(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min);
}

function generateData(
  amount: number,
  min: number,
  max: number,
  timestampStart: number,
  timestampTick: number,
): Array<[number, number]> {
  return Array.from(Array(amount).keys()).map(
    (v) =>
      [timestampStart + timestampTick * v, randomize(min, max)] as [
        number,
        number,
      ],
  );
}
