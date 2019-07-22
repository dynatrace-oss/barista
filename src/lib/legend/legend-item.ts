import {
  Component,
  Directive,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';

@Directive({
  selector: 'dt-legend-symbol, [dtLegendSymbol]',
  host: {
    class: 'dt-legend-symbol',
  },
})
export class DtLegendSymbol {}

@Component({
  selector: 'dt-legend-item',
  templateUrl: 'legend-item.html',
  styleUrls: ['legend-item.scss'],
  host: {
    class: 'dt-legend-item',
  },
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtLegendItem {}
