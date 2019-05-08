import { Component, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DtFilterFieldDefaultDataSource, DtFilterField, DtFilterFieldTag } from '@dynatrace/angular-components';
import { COMPLEX_DATA } from './data';
import { KUBERNETES_DATA } from './kubernetes-data';
import { TEST_DATA } from './testdata';
import { Subscription } from 'rxjs';

// tslint:disable:no-any

const DATA_SETS = new Map<string>([
  ['TEST_DATA', TEST_DATA],
  ['KUBERNETES_DATA', KUBERNETES_DATA],
  ['COMPLEX_DATA', COMPLEX_DATA],
]);

@Component({
  selector: 'filter-field-demo',
  templateUrl: './filter-field-demo.component.html',
  styleUrls: ['./filter-field-demo.component.scss'],
})
export class FilterFieldDemo implements AfterViewInit, OnDestroy {

  get dataSourceNames(): string[] { return Array.from(DATA_SETS.keys()); }

  get activeDataSourceName(): string { return this._activeDataSourceName; }
  set activeDataSourceName(value: string) {
    this._dataSource.data = DATA_SETS.get(value);
    this._activeDataSourceName = value;
  }

  get canSetValues(): boolean {
    return this._dataSource.data === TEST_DATA;
  }

  @ViewChild(DtFilterField) filterField: DtFilterField;

  private _activeDataSourceName = 'TEST_DATA';
  private _tagChangesSub = Subscription.EMPTY;
  _firstTag: DtFilterFieldTag;

  _dataSource = new DtFilterFieldDefaultDataSource(TEST_DATA);

  ngAfterViewInit(): void {
    this._tagChangesSub = this.filterField.tags.changes.subscribe(() => {
      Promise.resolve().then(() => this._firstTag = this.filterField.tags.first);
    });
  }

  ngOnDestroy(): void {
    this._tagChangesSub.unsubscribe();
  }

  filterChanges(event: any): void {
    console.log(event);
  }

  toggledDisableFirstTag(): void {
    if (this._firstTag) {
      this._firstTag.disabled = !this._firstTag.disabled;
    }
  }

  setValues(): void {
    if (this._dataSource.data === TEST_DATA) {
      const filter1 = [
        TEST_DATA.autocomplete[0],
        (TEST_DATA as any).autocomplete[0].autocomplete[0],
      ];
      this.filterField.filters = [filter1];
    }
  }
}
