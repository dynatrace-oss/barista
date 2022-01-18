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

import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ViewChild } from '@angular/core';
import {
  waitForAsync,
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtOverlayModule } from '@dynatrace/barista-components/overlay';
import { createComponent, dispatchFakeEvent } from '@dynatrace/testing/browser';
import { DtSunburstChart } from './sunburst-chart';
import { sunburstChartMock } from './sunburst-chart.mock';
import { DtSunburstChartModule } from './sunburst-chart.module';
import {
  DtSunburstChartHoverData,
  DtSunburstChartNode,
  DtSunburstChartNodeSlice,
} from './sunburst-chart.util';

describe('DtSunburstChart', () => {
  let fixture: ComponentFixture<TestApp>;
  let rootComponent: TestApp;
  let component: DtSunburstChart;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  let selectedChangeSpy;
  let selectSpy;

  const selectors = {
    overlay: '.dt-overlay-container',
    sunburst: 'dt-sunburst-chart',
    segment: '[dt-sunburst-chart-segment]',
    slice: '.dt-sunburst-chart-slice',
    sliceLabel: '.dt-sunburst-chart-slice-label',
    selectedSlice: '.dt-sunburst-chart-slice-current',
    sliceValue: '.dt-sunburst-chart-slice-value',
    selectedLabel: '.dt-sunburst-chart-selected-label',
    selectedValue: '.dt-sunburst-chart-selected-value',
  };

  describe('Default', () => {
    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
            DtSunburstChartModule,
          ],
          declarations: [TestApp],
          providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
        });

        TestBed.compileComponents();
        fixture = createComponent(TestApp);
        rootComponent = fixture.componentInstance;
        component = fixture.debugElement.query(
          By.directive(DtSunburstChart),
        ).componentInstance;

        selectedChangeSpy = jest.spyOn(component.selectedChange, 'emit');
        selectSpy = jest.spyOn(component, '_select');
      }),
    );

    describe('Series', () => {
      it('should render after change', () => {
        rootComponent.series = sunburstChartMock;
        fixture.detectChanges();

        const slices = fixture.debugElement.queryAll(By.css(selectors.slice));

        expect(slices.length).toEqual(2);

        expect(slices[0].nativeElement.getAttribute('d')).toBe(
          'M5.75583995599256e-15,-94A94,94,0,1,1,5.75583995599256e-15,94L4.0413344371862654e-15,66A66,66,0,1,0,4.0413344371862654e-15,-66Z',
        );
      });
    });

    describe('Selected', () => {
      it('should have no selection by default', () => {
        expect(component.selected).toEqual([]);
      });

      it('should find filled nodes when input', () => {
        rootComponent.series = sunburstChartMock;
        rootComponent.selected = [sunburstChartMock[0]];
        fixture.detectChanges();

        expect(component.selected).toEqual([
          {
            children: [
              {
                ariaLabel: 'Blue in Purple is 1',
                color: '#fff29a',
                depth: 1,
                id: '0.0',
                label: 'Blue',
                value: 1,
                valueRelative: 0.125,
                origin: expect.any(Object),
              },
              {
                ariaLabel: 'Red in Purple is 3',
                color: '#fff29a',
                depth: 1,
                id: '0.1',
                label: 'Red',
                value: 3,
                valueRelative: 0.375,
                origin: expect.any(Object),
              },
            ],
            ariaLabel: 'Purple is 4',
            color: '#fff29a',
            depth: 2,
            id: '0',
            label: 'Purple',
            value: 4,
            valueRelative: 0.5,
            origin: expect.any(Object),
          },
        ]);
      });
    });

    describe('Value Display Mode', () => {
      it('should be ABSOLUTE by default', () => {
        fixture.detectChanges();

        const actual = fixture.debugElement.query(
          By.css(selectors.selectedValue),
        );

        expect(actual.nativeElement.textContent).not.toContain('%');
      });

      it('should switch to percentage display when set', () => {
        rootComponent.valueDisplayMode = 'percent';
        fixture.detectChanges();

        const actual = fixture.debugElement.query(
          By.css(selectors.selectedValue),
        );

        expect(actual.nativeElement.textContent).toContain('%');
      });
    });

    describe('Select', () => {
      it('should emit empty selection', () => {
        component._select();

        expect(selectedChangeSpy).toHaveBeenCalledWith([]);
      });

      it('should emit selected nodes', () => {
        const selected = {
          data: {
            origin: sunburstChartMock[1].children[0],
            ariaLabel: 'Yellow in green is 3',
            active: false,
            childre: [],
            color: '',
            colorHover: '',
            depth: 1,
            id: '1.1',
            isCurrent: false,
            label: 'Yellow',
            showLabel: false,
            value: 3,
            valueRelative: 0.375,
            visible: true,
          },
          endAngle: 0,
          index: 0,
          labelPosition: [0, 0],
          padAngle: 0,
          path: '',
          showLabel: true,
          startAngle: 0,
          tooltipPosition: [0, 0],
          value: 3,
        } as DtSunburstChartNodeSlice;

        rootComponent.series = sunburstChartMock;
        fixture.detectChanges();

        const expected = [
          sunburstChartMock[1],
          sunburstChartMock[1].children[0],
        ];

        component._select(undefined, selected);

        expect(selectedChangeSpy).toHaveBeenCalledWith(expected);
      });

      it('should render', () => {
        rootComponent.series = sunburstChartMock;
        fixture.detectChanges();

        const firstSegment = fixture.debugElement.query(
          By.css(selectors.segment),
        );

        dispatchFakeEvent(firstSegment.nativeNode, 'click');
        fixture.detectChanges();

        const selectedSlice = fixture.debugElement.query(
          By.css(selectors.selectedSlice),
        );

        expect(selectedSlice.nativeElement.getAttribute('d')).toBe(
          'M6.490628035480972e-15,-106A106,106,0,1,1,6.490628035480972e-15,106L4.0413344371862654e-15,66A66,66,0,1,0,4.0413344371862654e-15,-66Z',
        );
      });

      it('should clean selection on click outside', () => {
        const sunburst = fixture.debugElement.query(By.css(selectors.sunburst));

        dispatchFakeEvent(sunburst.nativeNode, 'click');

        expect(selectSpy).toHaveBeenCalled();
      });
    });

    describe('Template', () => {
      beforeEach(function (): void {
        rootComponent.series = sunburstChartMock;
        fixture.detectChanges();
      });

      it('should show generic label when nothing selected', () => {
        const actual = fixture.debugElement.query(
          By.css(selectors.selectedLabel),
        );

        expect(actual.nativeElement.textContent.trim()).toBe('All');
      });

      it('should show specific label when selected', () => {
        rootComponent.selected = [sunburstChartMock[0]];
        fixture.detectChanges();
        const actual = fixture.debugElement.query(
          By.css(selectors.selectedLabel),
        );

        expect(actual.nativeElement.textContent.trim()).toBe('Purple');
      });

      it('should show slice label when nothing selected', () => {
        rootComponent.selected = [sunburstChartMock[0]];
        fixture.detectChanges();
        const actualLabel = fixture.debugElement.queryAll(
          By.css(selectors.sliceLabel),
        );
        const actualValue = fixture.debugElement.queryAll(
          By.css(selectors.sliceValue),
        );

        expect(actualLabel.length).toBe(sunburstChartMock.length);

        expect(actualValue.length).toBe(sunburstChartMock.length);
      });

      it('should show slice label when selected', () => {
        rootComponent.selected = [sunburstChartMock[0]];
        fixture.detectChanges();
        const actualLabel = fixture.debugElement.queryAll(
          By.css(selectors.sliceLabel),
        );
        const actualValue = fixture.debugElement.queryAll(
          By.css(selectors.sliceValue),
        );

        expect(actualLabel.length).toBe(2);

        expect(actualValue.length).toBe(2);
      });

      it('should show absolute values', () => {
        rootComponent.valueDisplayMode = 'absolute';
        fixture.detectChanges();
        const actualSelected = fixture.debugElement.query(
          By.css(selectors.selectedValue),
        );
        const actualSlice = fixture.debugElement.query(
          By.css(selectors.sliceValue),
        );

        expect(actualSelected.nativeElement.textContent).not.toContain('%');

        expect(actualSlice.nativeElement.textContent).not.toContain('%');
      });

      it('should show percent values', () => {
        rootComponent.valueDisplayMode = 'percent';
        fixture.detectChanges();
        const actualSelected = fixture.debugElement.query(
          By.css(selectors.selectedValue),
        );
        const actualSlice = fixture.debugElement.query(
          By.css(selectors.sliceValue),
        );

        expect(actualSelected.nativeElement.textContent).toContain('%');

        expect(actualSlice.nativeElement.textContent).toContain('%');
      });

      it('should show first level slices if nothing selected', () => {
        const actual = fixture.debugElement.queryAll(By.css(selectors.slice));

        expect(actual.length).toBe(sunburstChartMock.length);
      });

      it('should show slices when selected', () => {
        rootComponent.selected = [sunburstChartMock[0]];
        fixture.detectChanges();
        const actual = fixture.debugElement.queryAll(By.css(selectors.slice));

        expect(actual.length).toBe(4);
      });
    });
    describe('Hover events', () => {
      beforeEach(function (): void {
        rootComponent.series = sunburstChartMock;
        fixture.detectChanges();
      });
      it('Should emit hover info when hover events start on a slice', () => {
        const firstSegment = fixture.debugElement.query(
          By.css(selectors.segment),
        );
        dispatchFakeEvent(firstSegment.nativeElement, 'mouseenter');
        expect(rootComponent.hoverStart).toMatchObject({
          name: sunburstChartMock[0].label,
          color: '#fff29a',
          isCurrent: false,
          active: false,
          value: 0.5,
        });
      });
      it('Should emit hover info when hover events end on a slice', () => {
        const firstSegment = fixture.debugElement.query(
          By.css(selectors.segment),
        );
        dispatchFakeEvent(firstSegment.nativeElement, 'mouseleave');
        expect(rootComponent.hoverEnd).toMatchObject({
          name: sunburstChartMock[0].label,
          color: '#fff29a',
          isCurrent: false,
          active: false,
          value: 0.5,
        });
      });
    });
  });

  describe('Overlay', () => {
    beforeEach(
      waitForAsync(() => {
        TestBed.configureTestingModule({
          imports: [
            HttpClientTestingModule,
            DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
            DtSunburstChartModule,
            DtOverlayModule,
            NoopAnimationsModule,
          ],
          declarations: [TestWithOverlayApp],
          providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
        });

        TestBed.compileComponents();
      }),
    );

    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();

      fixture = createComponent(TestWithOverlayApp);
      rootComponent = fixture.componentInstance;
      component = fixture.debugElement.query(
        By.directive(DtSunburstChart),
      ).componentInstance;

      selectedChangeSpy = jest.spyOn(component.selectedChange, 'emit');
      selectSpy = jest.spyOn(component, '_select');
      rootComponent.series = sunburstChartMock;
      fixture.detectChanges();
    }));

    it('should have an overlay container defined', () => {
      expect(overlayContainer).toBeDefined();
    });

    it('should display and hide an overlay when called', () => {
      component.openOverlay(component.slices[0]);
      fixture.detectChanges();

      const overlayPane = overlayContainerElement.querySelector(
        selectors.overlay,
      );
      expect(overlayPane).toBeDefined();

      const overlayContent = (overlayPane!.textContent ?? '').trim();
      expect(overlayContent).toBe('Purple');

      component.closeOverlay();
      fixture.detectChanges();

      // we cannot check if it disappeared because of the animation, so let's check for an alternative
      expect(
        overlayPane?.attributes.getNamedItem('attr.aria-hidden'),
      ).toBeTruthy();
    });
  });
});

/** Test component that contains an DtSunburstChart. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-sunburst-chart
      [series]="series"
      [selected]="selected"
      [valueDisplayMode]="valueDisplayMode"
      [noSelectionLabel]="noSelectionLabel"
      (hoverStart)="hoverStart = $event"
      (hoverEnd)="hoverEnd = $event"
    >
    </dt-sunburst-chart>
  `,
})
class TestApp {
  series: DtSunburstChartNode[] = [];
  selected: DtSunburstChartNode[] = [];
  noSelectionLabel = 'All';
  valueDisplayMode;

  @ViewChild(DtSunburstChart) sunburstChart: DtSunburstChart;

  hoverStart: DtSunburstChartHoverData;
  hoverEnd: DtSunburstChartHoverData;
}

/** Test component that contains an DtSunburstChart with overlay. */
@Component({
  selector: 'dt-test-with-overlay-app',
  template: `
    <dt-sunburst-chart
      [series]="series"
      [selected]="selected"
      [valueDisplayMode]="valueDisplayMode"
      [noSelectionLabel]="noSelectionLabel"
      (hoverStart)="hoverStart = $event"
      (hoverEnd)="hoverEnd = $event"
    >
      <ng-template dtSunburstChartOverlay let-tooltip>
        <div>
          {{ tooltip.label }}
        </div>
      </ng-template>
    </dt-sunburst-chart>
  `,
})
class TestWithOverlayApp {
  series: DtSunburstChartNode[] = [];
  selected: DtSunburstChartNode[] = [];
  noSelectionLabel = 'All';
  valueDisplayMode;

  @ViewChild(DtSunburstChart) sunburstChart: DtSunburstChart;

  hoverStart: DtSunburstChartHoverData;
  hoverEnd: DtSunburstChartHoverData;
}
