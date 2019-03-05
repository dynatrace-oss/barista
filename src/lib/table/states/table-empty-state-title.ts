import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

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
export class DtTableEmptyStateTitle { }
