/**
 * @license
 * Copyright 2020 Dynatrace LLC
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
import { Component, ViewChild, DebugElement } from '@angular/core';
import {
  async,
  ComponentFixture,
  inject,
  TestBed,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtUiTestConfiguration,
  DT_UI_TEST_CONFIG,
} from '@dynatrace/barista-components/core';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtThemingModule } from '@dynatrace/barista-components/theming';
import { createComponent, dispatchFakeEvent } from '@dynatrace/testing/browser';
import { DtStackedSeriesChart } from './stacked-series-chart';
import { stackedSeriesChartDemoDataCoffee } from './stacked-series-chart.mock';
import { DtStackedSeriesChartModule } from './stacked-series-chart.module';
import {
  DtStackedSeriesChartFillMode,
  DtStackedSeriesChartLegend,
  DtStackedSeriesChartMode,
  DtStackedSeriesChartNode,
  DtStackedSeriesChartSeries,
  DtStackedSeriesChartValueDisplayMode,
} from './stacked-series-chart.util';

describe('DtStackedSeriesChart', () => {
  let fixture: ComponentFixture<TestApp>;
  let rootComponent: TestApp;
  let component: DtStackedSeriesChart;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  let selectedChangeSpy;

  /** Gets all tracks within the rendered chart. */
  function getAllTracks(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-track'),
    );
  }

  function getAllTrackBackgrounds(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-track-background'),
    );
  }

  /** Get all slices */
  function getAllSlices(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-slice'),
    );
  }

  /** Gets a specific slice at a specific position */
  function getSliceByPositionWithinTrack(
    trackIndex: number,
    sliceIndex: number,
  ): DebugElement {
    const track = getAllTracks()[trackIndex];
    return track.queryAll(By.css('.dt-stacked-series-chart-slice'))[sliceIndex];
  }

  /** Gets the selected slice */
  function getSelectedSlice(): DebugElement {
    return fixture.debugElement.query(
      By.css('.dt-stacked-series-chart-slice-selected'),
    );
  }

  /** Get all track labels */
  function getAllTrackLabels(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-track-label'),
    );
  }

  /** Get the legend for the current chart */
  function getLegend(): DebugElement {
    return fixture.debugElement.query(By.css('dt-legend'));
  }

  /** Gets the legend items */
  function getAllLegendItems(): DebugElement[] {
    return fixture.debugElement.queryAll(By.css('dt-legend-item'));
  }

  /** Get the hidden legend items */
  function getAllHiddenLegendItems(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-legend-item-hidden'),
    );
  }

  /** Gets the value axis element */
  function getValueAxis(): DebugElement {
    return fixture.debugElement.query(
      By.css('.dt-stacked-series-chart-value-axis'),
    );
  }

  /** Get the series axis element */
  function getSeriesAxis(): DebugElement {
    return fixture.debugElement.query(
      By.css('.dt-stacked-series-chart-series-axis'),
    );
  }

  /** Gets the ticks from the axis */
  function getAxisTicks(): DebugElement[] {
    return fixture.debugElement.queryAll(
      By.css('.dt-stacked-series-chart-value-axis'),
    );
  }

  /** Get the overlay container. */
  function getOverlay(): Element | null {
    return overlayContainerElement.querySelector(
      '.dt-stacked-series-chart-overlay-panel',
    );
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        DtStackedSeriesChartModule,
        DtThemingModule,
      ],
      declarations: [TestApp, DefaultsTestApp],
      providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
    });

    TestBed.compileComponents();
    fixture = createComponent(TestApp);

    rootComponent = fixture.componentInstance;
    component = fixture.debugElement.query(By.directive(DtStackedSeriesChart))
      .componentInstance;

    selectedChangeSpy = jest.spyOn(component.selectedChange, 'emit');
  }));

  describe('should have defaults', () => {
    let defComponent;

    beforeEach(() => {
      const defFixture = createComponent(DefaultsTestApp);
      defComponent = defFixture.debugElement.query(
        By.directive(DtStackedSeriesChart),
      ).componentInstance;
    });

    const propsAndDefaults = {
      selectable: false,
      selected: [],
      valueDisplayMode: 'none',
      _max: undefined,
      fillMode: 'relative',
      visibleLegend: true,
      visibleTrackBackground: true,
      visibleLabel: true,
      mode: 'bar',
      maxTrackSize: 16,
      visibleValueAxis: true,
    };

    Object.keys(propsAndDefaults).forEach((key) =>
      it(`${key} should be ${propsAndDefaults[key]}`, () =>
        expect(defComponent[key]).toEqual(propsAndDefaults[key])),
    );
  });

  describe('Series', () => {
    it('should render after change', () => {
      const tracks = getAllTracks();
      expect(tracks.length).toEqual(stackedSeriesChartDemoDataCoffee.length);
      const slice = getSliceByPositionWithinTrack(0, 0);
      expect(slice.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 20%',
      );
    });

    it('should update data after series input change', () => {
      const oldTracks = getAllTracks();

      const newSeries = stackedSeriesChartDemoDataCoffee.slice(1);
      rootComponent.series = newSeries;
      fixture.detectChanges();

      const newTracks = getAllTracks();
      const newSlice = getSliceByPositionWithinTrack(0, 0);

      expect(newTracks.length).not.toEqual(oldTracks.length);
      expect(newTracks.length).toEqual(newSeries.length);

      expect(newSlice.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 40%',
      );
    });
  });

  describe('Selectable + Selected', () => {
    it('should select nodes when input', () => {
      rootComponent.selectable = true;
      rootComponent.selected = [
        stackedSeriesChartDemoDataCoffee[1],
        stackedSeriesChartDemoDataCoffee[1].nodes[1],
      ];
      fixture.detectChanges();

      const sliceByPosition = getSliceByPositionWithinTrack(1, 1);
      const selected = getSelectedSlice();

      expect(selected).toBe(sliceByPosition);
    });

    it('should make a selection', () => {
      const sliceByPosition = getSliceByPositionWithinTrack(1, 1);
      dispatchFakeEvent(sliceByPosition.nativeElement, 'click');
      fixture.detectChanges();

      const selected = getSelectedSlice();

      expect(selectedChangeSpy).toHaveBeenCalledWith([
        component._tracks[1].origin,
        component._tracks[1].nodes[1].origin,
      ]);
      expect(selected).toBe(sliceByPosition);
    });

    it('should not allow selection from input if disabled', () => {
      rootComponent.selectable = false;
      rootComponent.selected = [
        stackedSeriesChartDemoDataCoffee[1],
        stackedSeriesChartDemoDataCoffee[1].nodes[1],
      ];
      fixture.detectChanges();

      const selected = getSelectedSlice();
      expect(selected).toBe(null);
    });

    it('should not allow selection from template if disabled', () => {
      rootComponent.selectable = false;
      fixture.detectChanges();
      selectedChangeSpy.mockClear();

      const sliceByPosition = getSliceByPositionWithinTrack(1, 1);
      dispatchFakeEvent(sliceByPosition.nativeElement, 'click');

      expect(selectedChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Value Display Mode', () => {
    describe('Single tracked', () => {
      beforeEach(() => {
        rootComponent.visibleLegend = true;

        rootComponent.series = [stackedSeriesChartDemoDataCoffee[3]];
        fixture.detectChanges();
      });

      it('should switch to ABSOLUTE display when set', () => {
        rootComponent.valueDisplayMode = 'absolute';
        fixture.detectChanges();

        const legendItem = getAllLegendItems()[1];
        expect(legendItem.nativeElement.textContent.trim()).toBe(
          '2  Chocolate',
        );
      });

      it('should switch to PERCENT display when set', () => {
        rootComponent.valueDisplayMode = 'percent';
        fixture.detectChanges();

        const legendItem = getAllLegendItems()[1];
        expect(legendItem.nativeElement.textContent.trim()).toBe(
          '40 %  Chocolate',
        );
      });

      it('should switch to NONE display when set', () => {
        rootComponent.valueDisplayMode = 'none';
        fixture.detectChanges();

        const legendItem = getAllLegendItems()[1];
        expect(legendItem.nativeElement.textContent.trim()).toBe('Chocolate');
      });
    });

    it('should not display value if multi series', () => {
      rootComponent.valueDisplayMode = 'percent';
      fixture.detectChanges();

      const legendItem = getAllLegendItems()[1];
      expect(legendItem.nativeElement.textContent.trim()).toBe('Milk');
    });
  });

  describe('Max + Fill mode', () => {
    it('should allow a max with fillMode=relative', () => {
      rootComponent.max = 100;
      fixture.detectChanges();

      const sliceByPosition = getSliceByPositionWithinTrack(0, 0);

      expect(sliceByPosition.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 1%',
      );
    });

    it('should ignore max with fillMode=full', () => {
      rootComponent.fillMode = 'full';
      rootComponent.max = 100;
      fixture.detectChanges();

      const sliceByPosition = getSliceByPositionWithinTrack(0, 0);

      expect(sliceByPosition.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 100%',
      );
    });

    it('should fill the whole bar if fillMode=full', () => {
      rootComponent.fillMode = 'full';
      fixture.detectChanges();

      const sliceByPosition = getSliceByPositionWithinTrack(0, 0);

      expect(sliceByPosition.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 100%',
      );
    });

    it('should take into account the rest of series when no max if fillMode=relative', () => {
      const sliceByPosition = getSliceByPositionWithinTrack(0, 0);

      expect(sliceByPosition.nativeElement.getAttribute('style')).toContain(
        '--dt-stacked-series-chart-length: 20%',
      );
    });
  });

  describe('Axis', () => {
    it('should not show value axis if hidden', () => {
      rootComponent.visibleValueAxis = false;
      fixture.detectChanges();

      const axis = getValueAxis();
      expect(axis).toBeNull();
    });

    it('should show value axis in column mode', () => {
      rootComponent.mode = 'column';
      rootComponent.visibleValueAxis = true;
      fixture.detectChanges();

      const axis = getValueAxis();
      expect(axis).not.toBeNull();
    });

    it('should show value axis in bar mode', () => {
      rootComponent.mode = 'bar';
      rootComponent.visibleValueAxis = true;
      fixture.detectChanges();

      const axis = getValueAxis();

      expect(axis).not.toBeNull();
    });

    it('should show have ticks', () => {
      const ticks = getAxisTicks();
      expect(ticks.length).toBeGreaterThan(0);
    });
  });

  describe('Legends', () => {
    it('should show the legend', () => {
      rootComponent.visibleLegend = true;
      fixture.detectChanges();

      const legend = getLegend();
      expect(legend).toBeTruthy();
    });

    it('should hide the legend', () => {
      rootComponent.visibleLegend = false;
      fixture.detectChanges();

      const legend = getLegend();
      expect(legend).toBeFalsy();
    });

    it('should hide nodes if hidden in legend', () => {
      const legends = component.legends?.slice() ?? [];
      // Coffee node
      legends[0].visible = false;
      rootComponent.legends = legends;
      fixture.detectChanges();

      const hiddenLegendItem = getAllHiddenLegendItems()[0];
      const tracks = getAllTracks();
      const hiddenSlices = getAllSlices().filter((slice) =>
        slice.nativeElement
          .getAttribute('style')
          .includes('--dt-stacked-series-chart-length: 0'),
      );

      // item to be hidden
      expect(hiddenLegendItem.nativeElement.textContent.trim()).toBe(
        legends[0].label,
      );
      // tracks to be all shown
      expect(tracks.length).toBe(4);
      // nodes to be hidden, coffee is present in all of them
      expect(hiddenSlices.length).toBe(4);
    });

    it('should toggle legend on click', () => {
      const firstLegendItem = getAllLegendItems()[0];
      dispatchFakeEvent(firstLegendItem.nativeElement, 'click');
      fixture.detectChanges();

      const hiddenLegendItems = getAllHiddenLegendItems().map((item) =>
        item.nativeElement.textContent.trim(),
      );

      expect(hiddenLegendItems).toEqual(['Coffee']);
    });

    it('should not allow all legends to be hidden', () => {
      const legends = component.legends?.slice() ?? [];
      legends.forEach((legend, i) => (legend.visible = i === 0));
      rootComponent.legends = legends;
      fixture.detectChanges();

      const firstLegendItem = getAllLegendItems()[0];
      dispatchFakeEvent(firstLegendItem.nativeElement, 'click');
      fixture.detectChanges();

      const hiddenLegendItems = getAllHiddenLegendItems().map((item) =>
        item.nativeElement.textContent.trim(),
      );

      expect(hiddenLegendItems).toEqual(['Milk', 'Water', 'Chocolate']);
    });
  });

  describe('Track background', () => {
    it('should show the track background by default', () => {
      const tracksWithBackground = getAllTrackBackgrounds();
      expect(tracksWithBackground.length).toBe(4);
    });

    it('should hide the track background when indicated', () => {
      rootComponent.visibleTrackBackground = false;
      fixture.detectChanges();

      const tracksWithBackground = getAllTrackBackgrounds();
      expect(tracksWithBackground.length).toBe(0);
    });
  });

  describe('Mode', () => {
    describe('Bar', () => {
      it('should display all the tracks and slices', () => {
        const tracks = getAllTracks();
        const slices = getAllSlices();

        expect(tracks.length).toBe(4);
        expect(slices.length).toBe(8);
      });

      it('should display left aligned labels', () => {
        rootComponent.visibleLabel = true;
        fixture.detectChanges();

        const labels = getAllTrackLabels();
        expect(labels.length).toBe(4);
      });

      it('should not display the label if required', () => {
        rootComponent.visibleLabel = false;
        fixture.detectChanges();

        const labels = getAllTrackLabels();
        expect(labels.length).toBe(0);
      });

      it('should not display the series axis', () => {
        const axis = getSeriesAxis();
        expect(axis).toBeFalsy();
      });
    });

    describe('Column', () => {
      beforeEach(function (): void {
        rootComponent.mode = 'column';
        fixture.detectChanges();
      });

      it('should display all the tracks and slices', () => {
        const tracks = getAllTracks();
        const slices = getAllSlices();

        expect(tracks.length).toBe(4);
        expect(slices.length).toBe(8);
      });

      it('should display bottom aligned labels', () => {
        rootComponent.visibleLabel = true;
        fixture.detectChanges();

        const labels = getAllTrackLabels();
        expect(labels.length).toBe(4);
      });

      it('should not display the label if required', () => {
        rootComponent.visibleLabel = false;
        fixture.detectChanges();

        const labels = getAllTrackLabels();
        expect(labels.length).toBe(0);
      });

      it('should display the series axis', () => {
        const axis = getSeriesAxis();
        expect(axis).toBeTruthy();
      });
    });
  });

  describe('Overlay', () => {
    beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    }));

    it('should have an overlay container defined', () => {
      expect(overlayContainer).toBeDefined();
    });

    it('should not display an overlay if missing', () => {
      rootComponent.hasOverlay = false;
      fixture.detectChanges();

      const firstSlice = getAllSlices()[0];

      dispatchFakeEvent(firstSlice.nativeElement, 'mouseenter');
      fixture.detectChanges();

      const overlayPane = getOverlay();
      expect(overlayPane).toBeNull();
    });
  });
});

/** Test component that contains an DtStackedSeriesChart. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-stacked-series-chart
      [dtTheme]="theme"
      [series]="series"
      [selected]="selected"
      [selectable]="selectable"
      [valueDisplayMode]="valueDisplayMode"
      [max]="max"
      [fillMode]="fillMode"
      [legends]="legends"
      [visibleLegend]="visibleLegend"
      [visibleTrackBackground]="visibleTrackBackground"
      [visibleLabel]="visibleLabel"
      [visibleValueAxis]="visibleValueAxis"
      [mode]="mode"
      [maxTrackSize]="maxTrackSize"
    >
      <ng-template dtStackedSeriesChartOverlay let-tooltip *ngIf="hasOverlay">
        <div>
          {{ tooltip.origin.label }}
        </div>
      </ng-template>
    </dt-stacked-series-chart>
  `,
})
class TestApp {
  series: DtStackedSeriesChartSeries[] = stackedSeriesChartDemoDataCoffee;
  selectable: boolean = true;
  selected: [DtStackedSeriesChartSeries, DtStackedSeriesChartNode] | [] = [];
  valueDisplayMode: DtStackedSeriesChartValueDisplayMode;
  max: number;
  fillMode: DtStackedSeriesChartFillMode = 'relative';
  legends: DtStackedSeriesChartLegend[];
  visibleLegend: boolean = true;
  visibleTrackBackground: boolean = true;
  visibleLabel: boolean = true;
  visibleValueAxis: boolean = true;
  mode: DtStackedSeriesChartMode;
  maxTrackSize: number;

  theme = 'blue';
  hasOverlay: boolean = true;
  @ViewChild(DtStackedSeriesChart) stackedSeriesChart: DtStackedSeriesChart;
}

/** Test component that contains an DtStackedSeriesChart. */
@Component({
  selector: 'dt-defaults-test-app',
  template: `
    <dt-stacked-series-chart [dtTheme]="theme" [series]="series">
    </dt-stacked-series-chart>
  `,
})
class DefaultsTestApp {
  series: DtStackedSeriesChartSeries[] = stackedSeriesChartDemoDataCoffee;
  theme = 'blue';

  @ViewChild(DtStackedSeriesChart) stackedSeriesChart: DtStackedSeriesChart;
}
