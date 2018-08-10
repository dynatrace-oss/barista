import { Directive, Self, InjectionToken, OnDestroy, Inject, forwardRef } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { DtTabGroup} from './tab-group';
import { DtTabChange, DtTab } from './tab/tab';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DtTabGroupNavigationControl, DtTabNavigationAdapter } from './navigation/tab-navigation-adapter';

/** Token for the separator between the tabgroup and tabid */
export const DT_TAB_GROUP_FRAGMENT_FN = new InjectionToken<(tabgroupid: string, tabid: string) => string>('DtTabGroupTabFragment');

@Directive({
  selector: '[dtTabGroupNavigation]',
  exportAs: 'dtTabGroupNavigation',
})
export class DtTabGroupNavigation implements DtTabGroupNavigationControl, OnDestroy {
  private _destroyed = new Subject<void>();

  constructor(
    @Self() private _tabGroup: DtTabGroup,
    private _locationStrategy: LocationStrategy,
    private _tabNavigationAdapter: DtTabNavigationAdapter
  ) { }

  ngAfterContentInit(): void {
    const usesPathLocationStrategy = this._locationStrategy instanceof PathLocationStrategy;
    if (usesPathLocationStrategy) {
      this._tabGroup.selectionChanged.pipe(takeUntil(this._destroyed))
      .subscribe((event: DtTabChange) => {
        if (event.isUserInteraction) {
          const toRemove = this._getTabs().filter((tab) => tab !== event.source).map((tab) => tab.id);
          this._tabNavigationAdapter.update(event.source.id, toRemove);
        }
      });
    }

    this._tabNavigationAdapter.registerTabControl(this);
  }

  _updateTabIds(ids: string[]): void {
    console.log(ids);
    const tabs = this._getTabs();
    if (tabs) {
      const matchingTab = tabs.find((tab) => !!ids.find((id) => tab.id === id));      
      if (matchingTab && !matchingTab.disabled) {
        tabs.forEach((tab) => {
          ids.includes(tab.id) ? tab._select(false) : tab._deselect();
        });
      } else {
        this._tabGroup._selectTab();
      }

    }
  }

  _getTabs(): DtTab[] { return this._tabGroup ? this._tabGroup._tabs.toArray() : []; }

  ngOnDestroy(): void {
    this._tabNavigationAdapter.unregisterTabControl(this);
    this._destroyed.next();
    this._destroyed.complete();
  }
}
