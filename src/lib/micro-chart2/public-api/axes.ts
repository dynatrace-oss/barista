import { Directive, Input, OnChanges, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

let uniqueId = 0;

export type DtMicroChartAxisOrientation = 'x' | 'y';

export class DtMicroChartAxis implements OnChanges, OnDestroy {
  /** Minimum extent of the axis. */
  @Input() min = 0;

  /** Maximum extent of the axis. */
  @Input() max: number;

  /** Orientation of the axis. Defines whether the axis applies to x or y orientation. */
  _orientation: DtMicroChartAxisOrientation;

  /** @internal Unique identifier for the axis within the chart. */
  _id = uniqueId++;

  /**
   * @internal
   * Emits whenever some inputs change
   */
  _stateChanges = new BehaviorSubject<DtMicroChartAxis>(this);

  /** OnChanges hook emits stateChanges. */
  ngOnChanges(): void {
    this._stateChanges.next(this);
  }

  /** OnDestroy hook completes stateChanges. */
  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}

@Directive({
  selector: 'dt-micro-chart-x-axis',
  exportAs: 'dtMicroChartXAxis',
})
export class DtMicroChartXAxis extends DtMicroChartAxis {
  _orientation: DtMicroChartAxisOrientation = 'x';
}

@Directive({
  selector: 'dt-micro-chart-y-axis',
  exportAs: 'dtMicroChartYAxis',
})
export class DtMicroChartYAxis extends DtMicroChartAxis {
  _orientation: DtMicroChartAxisOrientation = 'y';
}
