import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation, Optional, SkipSelf, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';
import { isDefined } from '../../core/util/type-util';

// tslint:disable-next-line no-any
export type RouterLinkAccepted = string | any[];

export enum DtBreadcrumbItemDisplayMode {
  RouterLink = 'router-link',
  ExternalLink = 'external',
  Active = 'active',
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

  /** Whether the item is active and therefore a static element that is not clickable. */
  @Input()
  get active(): boolean {
    if (isDefined(this._active)) {
      return this._active!;
    }
    if (isDefined(this._isRouterLinkActive)) {
      return this._isRouterLinkActive!;
    }
    return this._isLastItem;
  }
  set active(value: boolean) {
    // Coerce can only be done if value is defined.
    // Otherwise this will set the property to false when the value is undefined.
    this._active = isDefined(value) ? coerceBooleanProperty(value) : value;
  }

  @Input()
  get external(): boolean { return this._external; }
  set external(value: boolean) { this._external = coerceBooleanProperty(value); }

  @Input()
  get href(): RouterLinkAccepted | undefined { return this._href; }
  set href(value: RouterLinkAccepted | undefined) {
    this._href = value;
    if (value !== void 0) {
      this._isRouterLinkActive = this._checkIsRouterLinkActive(value);
    }
  }

  /**
   * Whether a router has been injected by DI.
   * This is needed to decouple this component from the router.
   * @internal
   */
  get _routerAvailable(): boolean { return isDefined(this._router); }

  /**
   * Determines how the item should be displayed (as an external link, a router link or as a static element)
   * This is needed so we can have a fallback mode (active) if the other checks do not match.
   * @internal
   */
  get _displayMode(): DtBreadcrumbItemDisplayMode {
    if (!this.active) {
      if (this.external) {
        return DtBreadcrumbItemDisplayMode.ExternalLink;
      } else if (this._routerAvailable) {
        return DtBreadcrumbItemDisplayMode.RouterLink;
      }
    }
    return DtBreadcrumbItemDisplayMode.Active;
  }

  /** Expose the display modes enum to the template */
  _displayModes = DtBreadcrumbItemDisplayMode;

  /**
   * Whether this item is the last item in the breadcrumb list.
   * Will be set from outside by the breadcrumb component.
   * @internal
   */
  get _lastItem(): boolean { return this._isLastItem; }
  set _lastItem(value: boolean) {
    if (this._isLastItem !== value) {
      this._isLastItem = value;
      this._changeDetectorRef.markForCheck();
    }
  }

  private _external = false;
  private _href: RouterLinkAccepted | undefined;
  private _active: boolean | undefined;
  private _isRouterLinkActive: boolean | undefined;
  private _isLastItem = true;

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    @Optional() @SkipSelf() private readonly _router?: Router,
    @Optional() @SkipSelf() private readonly _route?: ActivatedRoute
  ) { }

  private _checkIsRouterLinkActive(href: RouterLinkAccepted): boolean {
    if (this._router) {
      let urlTree: UrlTree | undefined;
      if (Array.isArray(href)) {
        urlTree = this._router.createUrlTree(href, {
          queryParamsHandling: 'merge',
        });
      } else if (this._route) {
        urlTree = this._mergeQueryParams(this._router.parseUrl(href));
      }
      if (urlTree) {
        return this._router.isActive(urlTree, true);
      }
    }
    return false;
  }

  private _mergeQueryParams(urlTree: UrlTree): UrlTree {
    urlTree.queryParams = {
      ...this._route!.snapshot.queryParams,
      ...urlTree.queryParams,
    };
    return urlTree;
  }
}
