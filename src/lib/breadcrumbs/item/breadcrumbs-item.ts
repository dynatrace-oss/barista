import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, UrlTree } from '@angular/router';

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

  @Input() active: boolean | undefined;

  @Input()
  get external(): boolean | undefined {
    return this._external;
  }

  set external(value: boolean | undefined) {
    this._external = coerceBooleanProperty(value);
  }

  @Input()
  get href(): RouterLinkAccepted {
    return this._href;
  }

  set href(value: RouterLinkAccepted) {
    this._href = value;
    this._isActive = this.checkIsActive(value);
  }

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
  }

  private _external = false;
  private _href: RouterLinkAccepted;
  _isActive = false;

  private checkIsActive(href: RouterLinkAccepted): boolean {
    if (this.active !== undefined) {
      return this.active;
    }

    let urlTree: UrlTree;
    if (Array.isArray(href)) {
      urlTree = this.router.createUrlTree(href, {
        queryParamsHandling: 'merge',
      });
    } else {
      urlTree = this.mergeQueryParams(this.router.parseUrl(href));
    }
    return this.router.isActive(urlTree, true);
  }

  private mergeQueryParams(urlTree: UrlTree): UrlTree {
    urlTree.queryParams = {
      ...this.route.snapshot.queryParams,
      ...urlTree.queryParams,
    };
    return urlTree;
  }
}
