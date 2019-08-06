import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * @deprecated Use `<dt-empty-state>` and `<dt-empty-state-item-title>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-title',
  styleUrls: ['./table-empty-state-title.scss'],
  template: '<ng-content></ng-content>',
  exportAs: 'dtTableEmptyStateTitle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-title',
  },
})
export class DtTableEmptyStateTitle {}
