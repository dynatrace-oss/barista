import { ChangeDetectionStrategy, ViewEncapsulation, Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-tab-label',
  exportAs: 'dtTabLabel',
  template: '<ng-content></ng-content>',
  host: {
    class: 'dt-tab-label',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTabLabel {}
