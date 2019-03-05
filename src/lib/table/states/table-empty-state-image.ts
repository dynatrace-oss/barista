import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';

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
export class DtTableEmptyStateImage { }
