import {
  Component,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtKeyValueListItem
} from './key-value-list-item';

const keyValueListThreeColumnsLayoutMinItems = 18;
const keyValueListTwoColumnsLayoutMinItems = 12;

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list',
  host : {
    'class': 'dt-key-value-list',
    '[attr.dt-column]': 'columns',
  },
  templateUrl: 'key-value-list.html',
  styleUrls: ['key-value-list.scss'],
  exportAs : 'dtKeyValueList',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueList {
  @ContentChildren(DtKeyValueListItem) items: QueryList<DtKeyValueListItem>;

  // tslint:disable:no-any no-magic-numbers
  get columns(): number {

    if (this.items.length > keyValueListThreeColumnsLayoutMinItems) {
        return 3;
    } else if (this.items.length > keyValueListTwoColumnsLayoutMinItems) {
        return 2;
    } else {
        return 1;
    }
  }
}
