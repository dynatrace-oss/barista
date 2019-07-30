import {
  Directive,
  Input,
  SimpleChanges,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

// let uniqueId = 1;

@Directive({
  selector: 'dt-radial-chart-series',
  exportAs: 'dtRadialChartSeries',
  host: {
    class: 'dt-radial-chart-series',
  },
})
export class DtRadialChartSeries implements OnChanges, OnDestroy {
  @Input() value: number;
  @Input() name: string;
  @Input() color: string; // TODO: nope! color should be set internally

  /** @internal fires when value changes */
  _valueChanges = new BehaviorSubject<DtRadialChartSeries>(this);

  ngOnChanges(_changes: SimpleChanges): void {
    this._valueChanges.next(this);
  }

  ngOnDestroy(): void {
    this._valueChanges.complete();
  }
}
