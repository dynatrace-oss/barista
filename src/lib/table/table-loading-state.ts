import { Component, ChangeDetectionStrategy, ViewEncapsulation, ContentChild } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-table-loading-state',
  styleUrls: ['./scss/table-loading-state.scss'],
  template: `<div class="floatLoading"><ng-content></ng-content></div>`,
  exportAs: 'dtTableLoadingState',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  host: {
    class: 'dt-table-loading-state',
  },
})
export class DtTableLoadingState { }
