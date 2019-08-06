import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * @deprecated Use `<dt-empty-state>` and `<dt-empty-state-item-img>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-image',
  styleUrls: ['./table-empty-state-image.scss'],
  template: '<ng-content></ng-content>',
  exportAs: 'dtTableEmptyStateImage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-image',
  },
})
export class DtTableEmptyStateImage {}
