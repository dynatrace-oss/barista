import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  ViewEncapsulation,
} from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';

interface ComponentItem {
  name: string;
  examples: Array<{ name: string; route: string }>;
}

@Component({
  selector: 'barista-side-nav',
  templateUrl: 'side-nav.component.html',
  styleUrls: ['side-nav.component.scss'],
  host: {
    class: 'barista-side-nav',
  },
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BaristaSideNav implements AfterContentInit, OnDestroy {
  @Input()
  get componentItems(): ComponentItem[] {
    return this._componentItems;
  }
  set componentItems(values: ComponentItem[]) {
    this._componentItems = values;
    this._updateFilteredComponentItems();
  }

  @Input('componentItemValue')
  get componentItemsFilterValue(): string {
    return this._componentItemsFilterValue;
  }
  set componentItemsFilterValue(value: string) {
    const filterValue = value.trim();

    if (this._componentItemsFilterValue !== filterValue) {
      this._componentItemsFilterValue = filterValue;
      this._updateFilteredComponentItems();
    }
  }

  get filteredComponentItems(): ComponentItem[] {
    return this._filteredComponentItems;
  }

  private _selectedComponentName = '';
  private _componentItemsFilterValue = '';
  private _urlSubscription: Subscription;
  private _componentItems: ComponentItem[] = [];
  private _filteredComponentItems: ComponentItem[] = [];

  constructor(
    private readonly _router: Router,
    private readonly _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngAfterContentInit(): void {
    this._filteredComponentItems = [...this._componentItems];
    this._urlSubscription = this._router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this._selectedComponentName = event.urlAfterRedirects.replace(
          /^\/?([A-Za-z0-9-]+)\/?.*$/,
          '$1',
        );
        this._changeDetectorRef.markForCheck();

        window.document.body.scrollIntoView(true);
      }
    });
  }

  ngOnDestroy(): void {
    this._urlSubscription.unsubscribe();
  }

  _isSelectedComponent(componentName: string): boolean {
    return this._selectedComponentName === componentName;
  }

  private _updateFilteredComponentItems(): void {
    if (this._componentItemsFilterValue.length === 0) {
      this._filteredComponentItems = [...this._componentItems];
    } else {
      const filterValue = this._componentItemsFilterValue.toLocaleLowerCase();

      this._filteredComponentItems = this._componentItems.filter(
        componentItem => {
          const componentItemName = componentItem.name.toLocaleLowerCase();

          return (
            componentItemName.includes(filterValue) ||
            componentItem.examples.find(example =>
              example.name.toLocaleLowerCase().includes(filterValue),
            ) !== undefined
          );
        },
      );
    }

    this._changeDetectorRef.markForCheck();
  }
}
