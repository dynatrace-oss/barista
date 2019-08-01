import {
  Directive,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Directive({
  selector: 'dt-radial-chart-series',
  exportAs: 'dtRadialChartSeries',
})
export class DtRadialChartSeries implements OnChanges, OnDestroy {
  @Input() value: number;
  @Input() name: string;
  @Input() color: string;

  /** @internal fires when value changes */
  _stateChanges = new BehaviorSubject<DtRadialChartSeries>(this);

  ngOnChanges(_changes: SimpleChanges): void {
    this._stateChanges.next(this);
  }

  ngOnDestroy(): void {
    this._stateChanges.complete();
  }
}
