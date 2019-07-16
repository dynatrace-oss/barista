// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  Component,
  ContentChild,
  ViewChild,
  AfterViewInit,
  OnDestroy,
} from '@angular/core';
import {
  async,
  TestBed,
  fakeAsync,
  inject,
  ComponentFixture,
  flush,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtChart,
  DtChartModule,
  DtThemingModule,
  DtChartHeatfield,
  DtChartHeatfieldActiveChange,
  DtChartOptions,
} from '@dynatrace/angular-components';
import { Subject, Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ENTER } from '@angular/cdk/keycodes';
import { dispatchKeyboardEvent } from '../../../testing/dispatch-events';
import { getDtHeatfieldUnsupportedChartError } from '@dynatrace/angular-components/chart/heatfield/chart-heatfield-errors';
import { createComponent } from '../../../testing/create-component';

const PLOTMARGIN_LEFT = 100;
const PLOTMARGIN_RIGHT = 100;

describe('DtChartHeatfield', () => {
  let overlayContainerElement: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtChartModule, DtThemingModule],
      declarations: [SingleHeatfield, MultipleHeatfield, DummyChart],
    });

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    })();

    TestBed.compileComponents();
  }));

  describe('Single heatfield', () => {
    let chart: DummyChart;
    let fixture: ComponentFixture<SingleHeatfield>;
    let instance: SingleHeatfield;
    let marker: HTMLElement;

    beforeEach(() => {
      fixture = createComponent(SingleHeatfield);
      instance = fixture.componentInstance;
      const chartDebug = fixture.debugElement.query(By.directive(DummyChart));
      chart = chartDebug.componentInstance as DummyChart;
      fixture.detectChanges();
      marker = chartDebug.query(By.css('.dt-chart-heatfield-marker'))
        .nativeElement;
    });

    describe('Positioning', () => {
      it('should scale the heatfield correctly', () => {
        validatePosition(fixture, 150, 50);
      });

      it('should rescale the heatfield correctly on container resize', () => {
        chart.width = 1200;
        fixture.detectChanges();
        chart._afterRender.next();
        validatePosition(fixture, 200, 100);
      });

      it('should clamp the heatfield to the axisMin', () => {
        instance.start = 50000;
        instance.end = 110000;
        chart.axisMin = 100000;
        chart.axisMax = 200000;
        fixture.detectChanges();
        chart._afterRender.next();
        validatePosition(fixture, 100, 50);
      });

      it('should clamp the heatfield to the axisMax', () => {
        instance.start = 90000;
        instance.end = 150000;
        fixture.detectChanges();
        chart._afterRender.next();
        validatePosition(fixture, 550, 50);
      });

      it('should clamp the heatfield to the axisMin and axisMax at the same time', () => {
        instance.start = 50000;
        instance.end = 250000;
        chart.axisMin = 100000;
        chart.axisMax = 200000;
        fixture.detectChanges();
        chart._afterRender.next();
        validatePosition(fixture, 100, 500);
      });

      it('should stretch the heatfield to the axisMax when end is undefined', () => {
        instance.end = undefined;
        chart.axisMin = 100000;
        chart.axisMax = 200000;
        fixture.detectChanges();
        chart._afterRender.next();
        validatePosition(fixture, 100, 500);
      });
    });

    describe('Activation', () => {
      it('should set correct classes on click', () => {
        marker.click();
        fixture.detectChanges();
        expect(marker.classList).toContain('dt-chart-heatfield-active');

        marker.click();
        fixture.detectChanges();
        expect(marker.classList).not.toContain('dt-chart-heatfield-active');
      });

      it('should open and close the overlay when marker clicked', fakeAsync(() => {
        expect(overlayContainerElement.textContent).toEqual('');
        marker.click();
        fixture.detectChanges();
        flush();

        expect(marker.classList).toContain('dt-chart-heatfield-active');
        expect(overlayContainerElement.textContent).toContain('Problem 1');

        marker.click();
        fixture.detectChanges();
        flush();

        expect(marker.classList).not.toContain('dt-chart-heatfield-active');
        expect(overlayContainerElement.textContent).toEqual('');
      }));

      it('should activate when enter pressed', fakeAsync(() => {
        marker.focus();
        dispatchKeyboardEvent(marker, 'keydown', ENTER);
        fixture.detectChanges();
        flush();
        expect(marker.classList).toContain('dt-chart-heatfield-active');
        expect(overlayContainerElement.textContent).toContain('Problem 1');
      }));

      it('should handle programmatic activation', () => {
        instance.isActive = true;
        fixture.detectChanges();
        expect(marker.classList).toContain('dt-chart-heatfield-active');
        expect(overlayContainerElement.textContent).toContain('Problem 1');
      });
    });

    describe('Coloring', () => {
      let heatfieldNative: HTMLElement;

      beforeEach(() => {
        heatfieldNative = fixture.debugElement.query(
          By.directive(DtChartHeatfield),
        ).nativeElement;
      });

      it('should have error by default', () => {
        expect(heatfieldNative.classList).toContain('dt-color-error');
      });

      it('should set color class correctly for "main"', () => {
        instance.color = 'main';
        fixture.detectChanges();
        expect(heatfieldNative.classList).toContain('dt-color-main');
      });
    });

    it('should focus the marker when tab clicked', () => {
      marker.focus();
      fixture.detectChanges();
      expect(document.activeElement).toBe(marker);
    });

    it('should emit whenever the active changes', () => {
      const heatfield: DtChartHeatfield = fixture.debugElement.query(
        By.directive(DtChartHeatfield),
      ).componentInstance;
      const activeChangeSpy = jest.fn();
      const sub: Subscription = heatfield.activeChange.subscribe(
        activeChangeSpy,
      );
      expect(activeChangeSpy).not.toHaveBeenCalled();
      instance.isActive = true;
      fixture.detectChanges();
      expect(activeChangeSpy).toHaveBeenCalledWith(
        expect.any(DtChartHeatfieldActiveChange),
      );
      sub.unsubscribe();
    });

    it('should throw an error when the chart has a category xAxis', fakeAsync(() => {
      expect(() => {
        chart.fakeCategoryAxis();
        chart._afterRender.next();
        flush();
      }).toThrow(getDtHeatfieldUnsupportedChartError());
    }));
  });

  describe('Multiple heatfield', () => {
    let fixture: ComponentFixture<MultipleHeatfield>;
    let instance: MultipleHeatfield;

    beforeEach(() => {
      fixture = createComponent(MultipleHeatfield);
      instance = fixture.componentInstance;
    });

    it('should handle that only one single heatfield can be active programmatically', () => {
      instance.active = 'second';
      expect(overlayContainerElement.textContent).toContain('Problem 1');
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('Problem 2');
    });

    it('should handle that only one single heatfield can be active', () => {
      expect(overlayContainerElement.textContent).toContain('Problem 1');
      const heatfields = fixture.debugElement.queryAll(
        By.directive(DtChartHeatfield),
      );
      heatfields[1]
        .query(By.css('.dt-chart-heatfield-marker'))
        .nativeElement.click();
      fixture.detectChanges();
      expect(overlayContainerElement.textContent).toContain('Problem 2');
    });
  });
});

function validatePosition(
  fixture: ComponentFixture<SingleHeatfield>,
  expectedLeft: number,
  expectedWidth: number,
): void {
  fixture.detectChanges();
  const chartMarkerDebugElement = fixture.debugElement.query(
    By.css('.dt-chart-heatfield-marker'),
  );
  const chartBackdropDebugElement = fixture.debugElement.query(
    By.css('.dt-chart-heatfield-backdrop'),
  );
  // cannot select svg subelements with By.css see - https://github.com/angular/angular/issues/15164
  const styleMarker = chartMarkerDebugElement.nativeElement.style;
  expect(styleMarker.left).toEqual(`${expectedLeft}px`);
  expect(styleMarker.width).toEqual(`${expectedWidth}px`);
  const styleBackdrop = chartBackdropDebugElement.nativeElement.style;
  expect(styleBackdrop.left).toEqual(`${expectedLeft}px`);
  expect(styleBackdrop.width).toEqual(`${expectedWidth}px`);
}

/** Test component that contains a heatfield */
@Component({
  selector: 'dt-single-heatfield',
  template: `
    <dt-dummy-chart>
      <dt-chart-heatfield
        [start]="start"
        [end]="end"
        [color]="color"
        [active]="isActive"
      >
        Problem 1:
      </dt-chart-heatfield>
    </dt-dummy-chart>
  `,
})
class SingleHeatfield {
  start: number | undefined = 10000;
  end: number | undefined = 20000;
  color: string;
  isActive: boolean;
}

/** Test component that contains an two heatfields */
@Component({
  selector: 'dt-multi-heatfield',
  template: `
    <dt-dummy-chart>
      <dt-chart-heatfield
        [start]="start"
        [end]="end"
        [color]="color"
        [active]="active === 'first'"
      >
        Problem 1:
      </dt-chart-heatfield>
      <dt-chart-heatfield
        [start]="start"
        [end]="end"
        [color]="color"
        [active]="active === 'second'"
      >
        Problem 2:
      </dt-chart-heatfield>
    </dt-dummy-chart>
  `,
})
class MultipleHeatfield {
  start = 10000;
  end = 20000;
  color: string;
  active = 'first';
}

/** Test component that fakes a dt-chart so we can test without highcharts */
@Component({
  selector: 'dt-dummy-chart',
  template: `
    <div #container>
      <ng-content select="dt-chart-heatfield"></ng-content>
      <svg [attr.width]="width" height="250" [attr.viewBox]="viewbox">
        <svg:rect
          class="highcharts-plot-background"
          [attr.x]="x"
          y="16"
          [attr.width]="plotWidth"
          height="200"
        ></svg:rect>
      </svg>
    </div>
  `,
  providers: [{ provide: DtChart, useExisting: DummyChart }],
})
class DummyChart implements AfterViewInit, OnDestroy {
  _afterRender = new Subject<boolean>();
  width = 700;
  x = PLOTMARGIN_LEFT;
  axisMin = 0;
  axisMax = 100000;
  dataMin = 10000;
  dataMax = 20000;
  _chartObject = {
    xAxis: [
      {
        getExtremes: (): Highcharts.Extremes => ({
          dataMin: this.dataMin,
          dataMax: this.dataMax,
          min: this.axisMin,
          max: this.axisMax,
        }),
      },
    ],
  };

  options: DtChartOptions;

  @ViewChild('container', { static: false }) container;

  @ContentChild(DtChartHeatfield, { static: false })
  heatfield: DtChartHeatfield;

  get plotWidth(): number {
    return this.width - PLOTMARGIN_LEFT - PLOTMARGIN_RIGHT;
  }

  get viewbox(): string {
    return `0 0 ${this.width} 250`;
  }

  ngAfterViewInit(): void {
    this._afterRender.next(true);
  }

  ngOnDestroy(): void {
    this._afterRender.complete();
  }

  fakeCategoryAxis(): void {
    this.options = {
      xAxis: [
        {
          categories: ['some category'],
        },
      ],
    };
  }
}
