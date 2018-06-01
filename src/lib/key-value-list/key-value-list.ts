import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Output,
  Directive,
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
  @Input() columns = 1;

  private getColumnsClass(): string {
    return 'dtKeyValueListColumns' + (this.columns);
  }
}