import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-key-value-list-item',
  templateUrl: 'key-value-list-item.html',
  styleUrls: ['key-value-list-item.scss'],
  host: {
    class: 'dt-key-value-list-item',
  },
  exportAs: 'dtKeyValueListItem',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtKeyValueListItem {
  @Input() key;
  @Input() value;
}
