import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Directive,
} from '@angular/core';

/** Key of a keyValueList, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-key-value-list-key`,
})
export class DtKeyValueListKey { }

/** Value of a keyValueList, needed as it's used as a selector in the API. */
@Directive({
  selector: `dt-key-value-list-value`,
})
export class DtKeyValueListValue { }

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
  /**
   * @since 2018-12-13
   * @deprecated please use dt-key-value-list-key
   * @breaking-change To be removed
   */
  @Input() key;

  /**
   * @since 2018-12-13
   * @deprecated please use dt-key-value-list-key
   * @breaking-change To be removed
   */
  @Input() value;
}
