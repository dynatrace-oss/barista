import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Optional
} from '@angular/core';
import { DtSimpleColumnBase } from './simple-column-base';
import { DtTable } from '../table';

@Component({
  selector: 'dt-simple-text-column',
  templateUrl: 'simple-text-column.html',
  styleUrls: ['./simple-column.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  /*
   * Deliberatley set to Default because the embedded view that gets created for the
   * dtColumDef can't handle onPush and results in ChangeAfterChecked error.
   */
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{ provide: DtSimpleColumnBase, useExisting: DtSimpleTextColumn }],
})
export class DtSimpleTextColumn<T> extends DtSimpleColumnBase<T> {
  // tslint:disable-next-line: no-any
  constructor(@Optional() table: DtTable<T>) {
    super(table);
  }
}
