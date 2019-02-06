import { Component, ChangeDetectionStrategy, ViewEncapsulation, Input } from '@angular/core';
import { trigger, transition, style, state, animate } from '@angular/animations';

@Component({
  selector: 'g[dt-micro-chart-point]',
  templateUrl: 'micro-chart-point.html',
  styleUrls: ['micro-chart-point.scss'],
  host: {
    '(mouseenter)': 'this._isHovered = true',
    '(mouseleave)': 'this._isHovered = false',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
  animations: [
    trigger('hoverTrigger', [
      state('hover', style({
        r: 8,
      })),
      transition('* => *', [
        animate('150ms'),
      ]),
    ]),
  ],
})
export class DtMicroChartPoint {
  @Input() x: number;

  @Input() y: number;

  @Input() value: number;

  @Input() min: boolean;

  @Input() max: boolean;

  get _isExtreme(): boolean {
    return this.min || this.max;
  }

  get _radius(): number {
    return  this._isExtreme ? 8 : 4;
  }

  _isHovered = false;
}
