import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ElementRef, ChangeDetectorRef,
} from '@angular/core';
import {replaceCssClass} from '@dynatrace/angular-components/core';

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
              private _changeDetectorRef: ChangeDetectorRef) { }

  private _severity: DtAlertSeverity;

  @Input()
  get severity(): DtAlertSeverity {
    return this._severity;
  }

  set severity(newValue: DtAlertSeverity) {
    replaceCssClass(this._el, this._calcCssClass(this._severity), this._calcCssClass(newValue));
    this._severity = newValue;
    this._changeDetectorRef.markForCheck();
  }

  private _calcCssClass(severity: DtAlertSeverity): string | undefined {
    return severity !== undefined ? `dt-alert-${severity.toString()}` : undefined;
  }
}
