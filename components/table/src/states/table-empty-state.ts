import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

import { DtTableEmptyStateImage } from './table-empty-state-image';
import { DtTableEmptyStateMessage } from './table-empty-state-message';
import { DtTableEmptyStateTitle } from './table-empty-state-title';

/**
 * @deprecated Use `<dt-empty-state>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state',
  styleUrls: ['./table-empty-state.scss'],
  templateUrl: 'table-empty-state.html',
  exportAs: 'dtTableEmptyState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state',
  },
})
export class DtTableEmptyState {
  /**
   * The image of the empty state.
   *
   * @breaking-change 5.0.0 Make internal
   */
  @ContentChild(DtTableEmptyStateImage, { static: true }) emptyImage; // tslint:disable-line:deprecation

  /**
   * The title of the empty state.
   *
   * @breaking-change 5.0.0 Make internal
   */
  @ContentChild(DtTableEmptyStateTitle, { static: true }) emptyTitle; // tslint:disable-line:deprecation

  /**
   * The message of the empty state.
   *
   * @breaking-change 5.0.0 Make internal
   */
  @ContentChild(DtTableEmptyStateMessage, { static: true }) emptyMessage; // tslint:disable-line:deprecation
}

/**
 * @deprecated Use `<dt-empty-state>` instead.
 * @breaking-change To be removed with 6.0.0.
 */
@Directive({
  selector: '[dtTableEmptyState]',
})
export class DtTableEmptyStateDirective {}
