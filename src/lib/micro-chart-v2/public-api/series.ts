import { ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

export type DtMicroChartSeriesType = 'line' | 'column' | 'bar';

export abstract class DtMicroChartSeries {
  readonly type: DtMicroChartSeriesType;

  data: any;

  /**
   * @internal
   * Emits whenever some inputs change
   */
  _stateChanges = new BehaviorSubject<DtMicroChartSeries>(this);

  ngOnChanges(changes: SimpleChanges): void {
    this._stateChanges.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
