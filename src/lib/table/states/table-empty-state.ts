
import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
} from '@angular/core';
import { DtTableEmptyStateImage } from './table-empty-state-image';
import { DtTableEmptyStateTitle } from './table-empty-state-title';
import { DtTableEmptyStateMessage } from './table-empty-state-message';

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
  @ContentChild(DtTableEmptyStateImage) emptyImage;
  @ContentChild(DtTableEmptyStateTitle) emptyTitle;
  @ContentChild(DtTableEmptyStateMessage) emptyMessage;
}

@Directive({
  selector: '[dtTableEmptyState]',
})
export class DtTableEmptyStateDirective { }
