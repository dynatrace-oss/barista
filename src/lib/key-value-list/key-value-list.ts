import {
  Component,
  Input,
  ContentChildren,
  QueryList,
  HostBinding
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list-item',
  templateUrl: 'key-value-list-item.html',
  styleUrls: ['key-value-list-item.scss'],
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
})
export class DtKeyValueList {
  @ContentChildren(DtKeyValueListItem) items: QueryList<DtKeyValueListItem>;

  @HostBinding('class')
  get columnsClass(): string {
    const threeColumnsLayoutMinItems = 18;
    const twoColumnsLayoutMinItems = 12;

    if (this.items.length > threeColumnsLayoutMinItems) {
        return `dtKeyValueListColumns3`;
    } else if (this.items.length > twoColumnsLayoutMinItems) {
        return `dtKeyValueListColumns2`;
    } else {
        return `dtKeyValueListColumns1`;
    }
  }
}
