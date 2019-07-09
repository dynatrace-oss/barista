import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Optional,
} from '@angular/core';
import { DtSimpleColumnBase } from './simple-column-base';
import { DtTable } from '../table';
import { isDefined, isNumber } from '@dynatrace/angular-components/core';
import { formatCount } from '@dynatrace/angular-components/formatters';

@Component({
  selector: 'dt-simple-number-column',
  templateUrl: 'simple-number-column.html',
  styleUrls: ['./simple-column.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  /*
   * Deliberatley set to Default because the embedded view that gets created for the
   * dtColumDef can't handle onPush and results in ChangeAfterChecked error.
   */
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [
    { provide: DtSimpleColumnBase, useExisting: DtSimpleNumberColumn },
  ],
})
export class DtSimpleNumberColumn<T> extends DtSimpleColumnBase<T> {
  // tslint:disable-next-line: no-any
  constructor(@Optional() table: DtTable<T>) {
    super(table);
  }

  /**
   * @internal Get data either returns a data access with the given name or calls the
   * displayAccessor function to get the simpleData for display.
   */
  // tslint:disable-next-line: no-any
  _getData(data: T): any {
    const output = this.displayAccessor
      ? this.displayAccessor(data, this.name)
      : (data as any)[this.name]; // tslint:disable-line:no-any

    if (isNumber(output) && !isDefined(this.formatter)) {
      return formatCount(output);
    }
    return this.formatter ? this.formatter(output) : output;
  }
}
