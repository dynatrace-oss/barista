import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Location } from '@angular/common';
import { DtRouterFragmentBuilder } from './tab-fragment-builder';

export interface DtTabGroupNavigationControl {
  _updateTabIds(tabIds: string[]): void;
}

@Injectable({ providedIn: 'root', deps: [Router, ActivatedRoute, Location] })
export abstract class DtTabNavigationAdapter {
  abstract registerTabControl(control: DtTabGroupNavigationControl): void;
  abstract unregisterTabControl(control: DtTabGroupNavigationControl): void;
  abstract update(id: string, idsToRemove: string[]): void;
}

export class DtTabRouterFragmentAdapter extends DtTabNavigationAdapter {

  private _controls = new Set<DtTabGroupNavigationControl>();
  private _tabIds = new Set<string>();

  constructor(private _router: Router, private _route: ActivatedRoute, private _location: Location) {
    super();
    _route.fragment.pipe(filter((fragment) => !!fragment)).subscribe((fragmentText) => {
      const ids = fragmentText.split(',').map((id) => id.trim());
      this._tabIds = new Set(ids);
      this._controls.forEach((control) => control._updateTabIds(ids));
    });
  }

  registerTabControl(control: DtTabGroupNavigationControl): void {
    if (this._controls.has(control)) {
      // TODO: error
    }
    this._controls.add(control);
    control._updateTabIds(Array.from(this._tabIds));
  }

  unregisterTabControl(control: DtTabGroupNavigationControl): void {
    if (!this._controls.has(control)) {
      // TODO: error
    }
    this._controls.delete(control);
  }

  /**
   * Updates the stored values in the hash havigation
   * takes one id that is added to the navigation and an array of ids to remove,
   * basically one tab gets added and all other tabs in the same tabgroup get removed
   */
  update(id: string, idsToRemove: string[]): void {
    idsToRemove.forEach((i) => { this._tabIds.delete(i); });
    this._tabIds.add(id);
    this._updateRouterFragment();
  }

  private _updateRouterFragment(): void {
    const fragment = DtRouterFragmentBuilder.build(this._tabIds);
    const url = this._router.createUrlTree([], { relativeTo: this._route, fragment }).toString();
    this._location.go(url);
  }
}
