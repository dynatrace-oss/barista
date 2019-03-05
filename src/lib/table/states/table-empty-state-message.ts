import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-table-empty-state-message',
  styleUrls: ['./table-empty-state-message.scss'],
  template: '<ng-content></ng-content>',
  exportAs: 'dtTableEmptyStateMessage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-empty-state-message',
  },
})
export class DtTableEmptyStateMessage { }
