import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  Directive,
  ContentChildren,
  QueryList,
} from '@angular/core';

@Component({
  moduleId: module.id,
  styleUrls: ['key-value-list.scss'],
  selector: 'dt-key-value-list-item',
  template : '<div class="splitter"></div><div class="dt">{{key}}</div><div class="dd">{{value}}</div>',
  host : {
    class : "dt-key-value-list-item"
  }
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

  private getColumnsClass(): string {
    var columns : number;
    if (this.items.length>18) {
        columns = 3;
    } else if (this.items.length>12) {
        columns = 2;
    } else {
        columns = 1;
    }
    return 'dtKeyValueListColumns' + (columns);
  }
}