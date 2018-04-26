import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'dt-table-empty-state-title',
})
export class DtTableEmptyStateTitle { }

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'dt-table-empty-state-message',
})
export class DtTableEmptyStateMessage { }

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: 'dt-table-empty-state-image',
})
export class DtTableEmptyStateImage { }

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state',
  styleUrls: ['./scss/table-empty-state.scss'],
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
