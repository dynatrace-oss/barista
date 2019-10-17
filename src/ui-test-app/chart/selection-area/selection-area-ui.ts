// tslint:disable no-magic-numbers
import { Component } from '@angular/core';
import { map } from 'rxjs/operators';

import { DataService } from '../../ui-test-app/data.service';
import { options } from './chart-options';

@Component({
  selector: 'barista-demo',
  templateUrl: './selection-area-ui.html',
})
export class ChartSelectionAreaUi {
  validRange = false;

  options = options;
  series$ = this._dataService
    .getFixture<{ data: Highcharts.IndividualSeriesOptions[] }>(
      '/data-small.json',
    )
    .pipe(map(result => result.data));

  constructor(private _dataService: DataService) {}

  rangeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  closed(): void {
    // emits when the selection gets closed
  }

  valueChanges(_value: number | [number, number]): void {
    // emits when the value changes
  }
}
