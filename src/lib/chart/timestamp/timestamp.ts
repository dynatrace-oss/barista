import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Directive,
  Renderer2,
  ElementRef,
  ViewChild,
  ViewEncapsulation,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'dt-chart-timestamp',
  templateUrl: 'timestamp.html',
  styleUrls: ['timestamp.scss'],
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'dt-chart-timestamp',
  },
})
export class DtChartTimestamp {

  /** hide the timestamp */
  get hidden(): boolean { return this._hidden; }
  set hidden(hidden: boolean) {
    this._hidden = hidden;
    this._changeDetectorRef.markForCheck();
  }
  private _hidden = false;

  @ViewChild('selector')
  private _selector: ElementRef<HTMLDivElement> | undefined;

  constructor(
    private _renderer: Renderer2,
    private _changeDetectorRef: ChangeDetectorRef,
    private _elementRef: ElementRef
  ) {}

  _setPosition(x: number): void {
    if (!this._selector) {
      return;
    }

    this._renderer.setStyle(
      this._selector.nativeElement,
      'transform',
      `translateX(${x}px)`
    );
  }
}
