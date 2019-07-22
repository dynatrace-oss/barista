import { Directive, Self, OnDestroy, AfterContentInit } from '@angular/core';
import { DtTabGroup } from '../tab-group';
import { DtTabChange, DtTab } from '../tab/tab';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  DtTabGroupNavigationControl,
  DtTabNavigationAdapter,
} from './tab-navigation-adapter';

/**
 * Directive that hooks up the tabgroup for navigation
 */
@Directive({
  selector: 'dt-tab-group[dtTabGroupNavigation]',
  exportAs: 'dtTabGroupNavigation',
})
export class DtTabGroupNavigation
  implements DtTabGroupNavigationControl, OnDestroy, AfterContentInit {
  private _destroyed = new Subject<void>();

  constructor(
    @Self() private _tabGroup: DtTabGroup,
    private _tabNavigationAdapter: DtTabNavigationAdapter,
  ) {}

  ngAfterContentInit(): void {
    /** subscribes to selectionchanges and notifies navigation adapter on user interaction triggered changes */
    this._tabGroup.selectionChanged
      .pipe(takeUntil(this._destroyed))
      .subscribe((event: DtTabChange) => {
        if (event.isUserInteraction) {
          const toRemove = this._getTabs()
            .filter(tab => tab !== event.source)
            .map(tab => tab.id);
          this._tabNavigationAdapter.update(event.source.id, toRemove);
        }
      });

    this._tabNavigationAdapter.registerTabControl(this);
  }

  ngOnDestroy(): void {
    this._tabNavigationAdapter.unregisterTabControl(this);
    this._destroyed.next();
    this._destroyed.complete();
  }

  /** Adapter calls this function with ids - selects the tab for these ids */
  _updateWithTabIds(ids: string[]): void {
    const tabs = this._getTabs();
    if (tabs) {
      const matchingTab = tabs.find(tab => !!ids.find(id => tab.id === id));
      if (matchingTab && !matchingTab.disabled) {
        tabs.forEach(tab => {
          // tslint:disable-next-line no-void-expression
          ids.includes(tab.id) ? tab._select(false) : tab._deselect();
        });
      } else {
        this._tabGroup._selectTab();
      }
    }
  }

  /** Returns the tabgroup tabs as array */
  private _getTabs(): DtTab[] {
    return this._tabGroup ? this._tabGroup._tabs.toArray() : [];
  }
}
