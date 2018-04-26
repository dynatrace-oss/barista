const CONTENT_TEMPLATE = `<ng-content></ng-content>`;

import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  Directive,
  ContentChild,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-title',
  styleUrls: ['./scss/table-empty-state-title.scss'],
  template: CONTENT_TEMPLATE,
  exportAs: 'dtTableEmptyStateTitle',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-title',
  },
})
export class DtTableEmptyStateTitle { }

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-message',
  styleUrls: ['./scss/table-empty-state-message.scss'],
  template: CONTENT_TEMPLATE,
  exportAs: 'dtTableEmptyStateMessage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-message',
  },
})
export class DtTableEmptyStateMessage { }

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-image',
  styleUrls: ['./scss/table-empty-state-image.scss'],
  template: CONTENT_TEMPLATE,
  exportAs: 'dtTableEmptyStateImage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-image',
  },
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

@Directive({
  selector: '[dtTableEmptyState]',
})
export class DtTableEmptyStateDirective { }
