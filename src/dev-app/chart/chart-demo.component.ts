// tslint:disable no-magic-numbers no-any max-file-line-count
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { chartOptions } from './chart-options';
import { dataBig, dataSmall } from './data-service';

@Component({
  selector: 'chart-demo',
  templateUrl: './chart-demo.component.html',
  styleUrls: ['./chart-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartDemo {
  validRange = false;
  options = chartOptions;
  series = dataSmall;

  dataSet = 'small';

  onTimeframeValidChanges(valid: boolean): void {
    this.validRange = valid;
  }

  switchData(): void {
    if (this.dataSet === 'small') {
      this.series = dataBig;
      this.dataSet = 'large';
      return;
    }
    this.series = dataSmall;
    this.dataSet = 'small';
  }

  onTimeframeApply(): void {
    console.log('do something');
  }
}
