import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-legend',
  exportAs: 'dtLegend',
  templateUrl: 'legend.html',
  styleUrls: ['legend.scss'],
  host: {
    class: 'dt-legend',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtLegend {}
