import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ElementRef, Renderer2, ChangeDetectorRef,
} from '@angular/core';

export type DtAlertSeverity = 'error' | 'warning' | undefined;

@Component({
  moduleId: module.id,
  selector: 'dt-alert',
  templateUrl: 'alert.html',
  styleUrls: ['alert.scss'],
  host: {
    role: 'alert',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtAlert {

  constructor(private _el: ElementRef,
              private _renderer: Renderer2,
              private _changeDetectorRef: ChangeDetectorRef) { }

  private _severity: DtAlertSeverity;

  @Input()
  get severity(): DtAlertSeverity {
    return this._severity;
  }

  set severity(newValue: DtAlertSeverity) {
    if (this._severity !== undefined) {
      this._renderer.removeClass(this._el.nativeElement, this._severity.toString());
    }
    this._severity = newValue;
    if (this._severity !== undefined) {
      this._renderer.addClass(this._el.nativeElement, this._severity.toString());
    }
    this._changeDetectorRef.markForCheck();
  }
}
