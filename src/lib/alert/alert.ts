import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation, Input, ElementRef, ChangeDetectorRef,
} from '@angular/core';
import {replaceCssClass} from '@dynatrace/angular-components/core';

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

  private _severity: 'error' | 'warning' | undefined;

  /**
   * The severity type of the alert.
   * @breaking-change Remove undefined as a severity type. Use ngIf instead.
   */
  @Input()
  get severity(): 'error' | 'warning' | undefined { return this._severity; }
  set severity(value: 'error' | 'warning' | undefined) {
    replaceCssClass(this._el, this._calcCssClass(this._severity), this._calcCssClass(value));
    this._severity = value;
    this._changeDetectorRef.markForCheck();
  }

  private _calcCssClass(severity: 'error' | 'warning' | undefined): string | undefined {
    return severity !== undefined ? `dt-alert-${severity.toString()}` : undefined;
  }
}
