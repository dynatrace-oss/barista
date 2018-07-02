import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, ChangeDetectorRef, Optional, Inject } from '@angular/core';
import { Router, UrlTree } from '@angular/router';

// tslint:disable-next-line no-any
export type RouterLinkAccepted = string | any[];

function routerNotFoundError(): Error {
  return new Error('Router not found. Cannot set internal link without router provided');
}

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

  calculatedHref(): string | undefined {
    if (this.href === undefined) {
      return undefined;
    }

    if (this.external) {
      return this.href.toString();
    }

    if (this._router === null) {
      throw routerNotFoundError();
    }

    let urlTree: UrlTree;
    if (Array.isArray(this.href)) {
      urlTree = this._router.createUrlTree(this.href, {
        queryParamsHandling: 'merge',
      });
    } else {
      urlTree = this._router.parseUrl(this.href);
    }
    return this._router.serializeUrl(urlTree);
  }

  private _external = false;
  private _isLastItem = false;

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(Router) private readonly _router: Router | null
    ) {}
}
