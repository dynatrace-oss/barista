import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface NavItem {
  name: string;
  route: string;
}

@Component({
  selector: 'dev-app',
  styleUrls: ['devapp.component.scss'],
  templateUrl: 'devapp.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DevApp implements AfterContentInit, OnDestroy {
  navItems: NavItem[] = [
    { name: 'Alert', route: '/alert' },
    { name: 'Autocomplete', route: '/autocomplete' },
    { name: 'Bar indicator', route: '/bar-indicator' },
    { name: 'Breadcrumbs', route: '/breadcrumbs' },
    { name: 'Button', route: '/button' },
    { name: 'Button-group', route: '/button-group' },
    { name: 'Card', route: '/card' },
    { name: 'Chart', route: '/chart' },
    { name: 'Checkbox', route: '/checkbox' },
    { name: 'Consumption', route: '/consumption' },
    { name: 'Context-dialog', route: '/context-dialog' },
    { name: 'Copy-to-clipboard', route: '/copy-to-clipboard' },
    { name: 'Cta-card', route: '/cta-card' },
    { name: 'Drawer', route: '/drawer' },
    { name: 'Expandable-panel', route: '/expandable-panel' },
    { name: 'Expandable-section', route: '/expandable-section' },
    { name: 'Filter-field', route: '/filter-field' },
    { name: 'Form-field', route: '/form-field' },
    { name: 'Formatters', route: '/formatters' },
    { name: 'Highlight', route: '/highlight' },
    { name: 'Icon', route: '/icon' },
    { name: 'Info-group', route: '/info-group' },
    { name: 'Inline-editor', route: '/inline-editor' },
    { name: 'Input', route: '/input' },
    { name: 'Key-value-list', route: '/key-value-list' },
    { name: 'Legend', route: '/legend' },
    { name: 'Link', route: '/link' },
    { name: 'Loading-distractor', route: '/loading-distractor' },
    { name: 'Micro-chart', route: '/micro-chart' },
    { name: 'Overlay', route: '/overlay' },
    { name: 'Pagination', route: '/pagination' },
    { name: 'Progress-bar', route: '/progress-bar' },
    { name: 'Progress-circle', route: '/progress-circle' },
    { name: 'Radio', route: '/radio' },
    { name: 'Select', route: '/select' },
    { name: 'Selection-area', route: '/selection-area' },
    { name: 'Show-more', route: '/show-more' },
    { name: 'Switch', route: '/switch' },
    { name: 'Table', route: '/table' },
    { name: 'Tabs', route: '/tabs' },
    { name: 'Tag', route: '/tag' },
    { name: 'Tile', route: '/tile' },
    { name: 'Timeline-chart', route: '/timeline-chart' },
    { name: 'Toggle-button-group', route: '/toggle-button-group' },
    { name: 'Toast', route: '/toast' },
    { name: 'TreeTable', route: '/tree-table' },
  ];
  selectedTheme = 'turquoise';
  themes = [
    { value: 'turquoise', name: 'Turquoise' },
    { value: 'turquoise:dark', name: 'Turquoise dark' },
    { value: 'blue', name: 'Blue' },
    { value: 'blue:dark', name: 'Blue dark' },
    { value: 'purple', name: 'Purple' },
    { value: 'purple:dark', name: 'Purple dark' },
    { value: 'royalblue', name: 'Royalblue' },
    { value: 'royalblue:dark', name: 'Royalblue dark' },
  ];

  private _urlSubscription: Subscription;
  private _navItemsFilterValue = '';
  private _filteredNavItems = [...this.navItems];

  @Input('navItemValue')
  get navItemsFilterValue(): string {
    return this._navItemsFilterValue;
  }
  set navItemsFilterValue(value: string) {
    const filterValue = value.trim();

    if (this._navItemsFilterValue !== filterValue) {
      this._navItemsFilterValue = filterValue;
      this._updateFilteredNavItems();
    }
  }

  get filteredNavItems(): NavItem[] {
    return this._filteredNavItems;
  }

  constructor(
    private readonly _router: Router,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterContentInit(): void {
    this._urlSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        window.document.body.scrollIntoView(true);
      }
    });
  }

  ngOnDestroy(): void {
    this._urlSubscription.unsubscribe();
  }

  private _updateFilteredNavItems(): void {
    if (this._navItemsFilterValue.length === 0) {
      this._filteredNavItems = [...this.navItems];
    } else {
      const filterValue = this._navItemsFilterValue.toLocaleLowerCase();

      this._filteredNavItems = this.navItems.filter(navItem =>
        navItem.name.toLocaleLowerCase().includes(filterValue),
      );
    }

    this._changeDetectorRef.markForCheck();
  }
}
