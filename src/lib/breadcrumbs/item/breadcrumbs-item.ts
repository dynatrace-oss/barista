import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { LocationStrategy } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  Optional,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

// tslint:disable-next-line no-any
export type RouterLinkAccepted = string | any[];

function routerNotFoundError(): Error {
  return new Error(
    'Router dependency not found. Cannot set internal link without router provided',
  );
}

const ensureProvided = <T extends Router | LocationStrategy | ActivatedRoute>(
  variable: T | null,
): T => {
  if (variable === null) {
    throw routerNotFoundError();
  }
  return variable;
};

/**
 * @deprecated Use {@link DtBreadcrumbsItem2} instead.
 * @breaking-change To be removed with 6.0.0
 */
@Component({
  moduleId: module.id,
  selector: 'dt-breadcrumbs-item',
  exportAs: 'dtBreadcrumbsItem',
  templateUrl: './breadcrumbs-item.html',
  styleUrls: ['./breadcrumbs-item.scss'],
  host: {
    class: 'dt-breadcrumbs-item',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbsItem {
  @Input()
  get external(): boolean {
    return this._external;
  }

  set external(value: boolean) {
    this._external = coerceBooleanProperty(value);
  }

  @Input() href?: RouterLinkAccepted;

  /**
   * Whether this item is the last item in the breadcrumb list.
   * Will be set from outside by the breadcrumb component.
   * @internal
   */
  get _lastItem(): boolean {
    return this._isLastItem;
  }

  set _lastItem(value: boolean) {
    if (this._isLastItem !== value) {
      this._isLastItem = value;
      Promise.resolve().then(() => {
        this._changeDetectorRef.markForCheck();
      });
    }
  }

  /** @internal Calculate the href property. */
  _calculatedHref(): string | undefined {
    if (this.href === undefined) {
      return undefined;
    }

    if (this.external) {
      return this.href.toString();
    }

    return ensureProvided(this._locationStrategy).prepareExternalUrl(
      ensureProvided(this._router).serializeUrl(this._createUrlTree()),
    );
  }

  private _external = false;
  private _isLastItem = false;

  constructor(
    private readonly _changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(Router) private readonly _router: Router | null,
    @Optional()
    @Inject(LocationStrategy)
    private readonly _locationStrategy: LocationStrategy | null,
    @Optional()
    @Inject(ActivatedRoute)
    private readonly _activatedRoute: ActivatedRoute | null,
  ) {}

  /** Create the url tree for the router state. */
  private _createUrlTree(): UrlTree {
    if (Array.isArray(this.href)) {
      return ensureProvided(this._router).createUrlTree(this.href, {
        queryParamsHandling: 'merge',
      });
    }

    const urlTree = ensureProvided(this._router).parseUrl(this.href as string);
    urlTree.queryParams = {
      ...ensureProvided(this._activatedRoute).snapshot.queryParams,
      ...urlTree.queryParams,
    };

    return urlTree;
  }

  // calling navigateByUrl is needed to avoid page reload if the link targets the same app.
  // Regular click on a with [href] causes page reload.
  // See:  https://github.com/angular/angular/blob/05e3e4d71eb84617a7d3/packages/router/src/directives/router_link.ts#L227-L243
  _linkClicked(event: MouseEvent): boolean {
    if (
      event.button !== 0 ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    ) {
      return true;
    }

    if (this.external) {
      return true;
    }

    ensureProvided(this._router).navigateByUrl(this._createUrlTree());
    return false;
  }
}
