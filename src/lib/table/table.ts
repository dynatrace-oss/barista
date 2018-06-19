import {
  Component,
  AfterContentChecked,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from '@angular/core';
import { CdkTable } from '@angular/cdk/table';

@Component({
  moduleId: module.id,
  selector: 'dt-table',
  styleUrls: ['./scss/table.scss'],
  templateUrl: './table.html',
  exportAs: 'dtTable',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table',
  },
})
export class DtTable<T> extends CdkTable<T> implements AfterContentChecked {
  @Input() isLoading: boolean;

  get isEmptyDataSource(): boolean {
    return !(this._data.length);
  }

  renderRows(): void {
    super.renderRows();

    if (!this._data.length) {
      this._changeDetectorRef.markForCheck();
    }
  }
}
