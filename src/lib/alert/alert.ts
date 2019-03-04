import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ElementRef, ChangeDetectorRef,
} from '@angular/core';
import {replaceCssClass} from '@dynatrace/angular-components/core';

/**
 * Defines the alert severity levels.
 * @deprecated Use 'error' | 'warning' instead
 * @breaking-change 2.0.0 To be removed
 */
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

  constructor(private _el: ElementRef, private _changeDetectorRef: ChangeDetectorRef) { }

  private _severity: 'error' | 'warning';

  /** The severity type of the alert. */
  @Input()
  get severity(): 'error' | 'warning' { return this._severity; }
  set severity(value: 'error' | 'warning') {
    replaceCssClass(this._el, this._calcCssClass(this._severity), this._calcCssClass(value));
    this._severity = value;
    this._changeDetectorRef.markForCheck();
  }

  private _calcCssClass(severity: 'error' | 'warning'): string | undefined {
    return `dt-alert-${severity.toString()}`;
  }
}
