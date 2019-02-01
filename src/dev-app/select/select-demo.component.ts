import { Component, ViewChild } from '@angular/core';
import { DtSelect } from '@dynatrace/angular-components/select';

@Component({
  selector: 'select-demo',
  templateUrl: './select-demo.component.html',
  styleUrls: ['./select-demo.component.scss'],
})
export class SelectDemo {
  hasMedian = false;
  @ViewChild('median', { read: DtSelect, static: true }) medianSelect: DtSelect<
    string
  >;

  changeToMedian(): void {
    this.medianSelect.value = 'Median';
    this.hasMedian = true;
  }
}
