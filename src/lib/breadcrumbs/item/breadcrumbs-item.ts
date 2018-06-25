import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';

// tslint:disable-next-line no-any
export type RouterLinkAccepted = string | any[];

@Component({
  moduleId: module.id,
  selector: 'dt-breadcrumbs-item',
  exportAs: 'dtBreadcrumbsItem',
  templateUrl: './breadcrumbs-item.html',
  styleUrls: ['./breadcrumbs-item.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbsItem {
  @Input()
  get external(): boolean { return this._external; }
  set external(value: boolean) { this._external = coerceBooleanProperty(value); }

  @Input() href: RouterLinkAccepted | undefined;

  /**
   * Whether this item is the last item in the breadcrumb list.
   * Will be set from outside by the breadcrumb component.
   * @internal
   */
  get _lastItem(): boolean { return this._isLastItem; }
  set _lastItem(value: boolean) {
    if (this._isLastItem !== value) {
      this._isLastItem = value;
      // tslint:disable-next-line:no-floating-promises
      Promise.resolve().then(() => { this._changeDetectorRef.markForCheck(); });
    }
  }

  private _external = false;
  private _isLastItem = true;

  constructor(private readonly _changeDetectorRef: ChangeDetectorRef) { }
}
