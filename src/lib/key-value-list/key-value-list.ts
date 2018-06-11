import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  ContentChildren,
  QueryList,
} from '@angular/core';

@Component({
  moduleId: module.id,
  styleUrls: ['key-value-list.scss'],
  selector: 'dt-key-value-list-item',
  template : '<div class="splitter"></div><div class="dt">{{key}}</div><div class="dd">{{value}}</div>',
  host : {
    class : 'dt-key-value-list-item',
  },
})
export class DtKeyValueListItem {
  @Input() key;
  @Input() value;
}

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list',
  templateUrl: 'key-value-list.html',
  styleUrls: ['key-value-list.scss'],
  host: {
    class: 'dt-key-value-list',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueList {
  @ContentChildren(DtKeyValueListItem) items: QueryList<DtKeyValueListItem>;

  getColumnsClass(): string {
    const COLUMNS_3_ITEMS = 18;
    const COLUMNS_2_ITEMS = 12;
    const COLUMNS_3 = 3;
    const COLUMNS_2 = 2;
    const COLUMNS_1 = 1;
    let columns: number;
    if (this.items.length > COLUMNS_3_ITEMS) {
        columns = COLUMNS_3;
    } else if (this.items.length > COLUMNS_2_ITEMS) {
        columns = COLUMNS_2;
    } else {
        columns = COLUMNS_1;
    }
    return `dtKeyValueListColumns${columns}`;
  }
}
