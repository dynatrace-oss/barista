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
  exportAs : 'dt-key-value-list-item',
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
    '[class]': 'columnsClass',
  },
  templateUrl: 'key-value-list.html',
  styleUrls: ['key-value-list.scss'],
  exportAs : 'dt-key-value-list',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueList {
  @ContentChildren(DtKeyValueListItem) items: QueryList<DtKeyValueListItem>;

  get columnsClass(): string {
    const threeColumnsLayoutMinItems = 18;
    const twoColumnsLayoutMinItems = 12;

    if (this.items.length > threeColumnsLayoutMinItems) {
        return `dt-key-value-list-columns3`;
    } else if (this.items.length > twoColumnsLayoutMinItems) {
        return `dt-key-value-list-columns2`;
    } else {
        return `dt-key-value-list-columns1`;
    }
  }
}
