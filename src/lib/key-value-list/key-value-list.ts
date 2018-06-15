import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list-item',
  templateUrl: 'key-value-list-item.html',
  styleUrls: ['key-value-list-item.scss'],
  host : {
    class : 'dt-key-value-list-item',
  },
  exportAs : 'dtKeyValueListItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueListItem {
  @Input() key;
  @Input() value;
}

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list',
  host : {
    'class': 'dt-key-value-list',
    '[attr.columns]': 'columns',
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
    const threeColumnsLayoutMinItems = 18;
    const twoColumnsLayoutMinItems = 12;

    if (this.items.length > threeColumnsLayoutMinItems) {
        return 3;
    } else if (this.items.length > twoColumnsLayoutMinItems) {
        return 2;
    } else {
        return 1;
    }
  }
}
