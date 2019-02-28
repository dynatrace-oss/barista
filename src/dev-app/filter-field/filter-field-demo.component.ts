import { Component } from '@angular/core';
import { DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components';
import { COMPLEX_DATA } from './data';
import { KUBERNETES_DATA } from './kubernetes-data';
import { TEST_DATA } from './testdata';

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
export class FilterFieldDemo {

  get dataSourceNames(): string[] { return Array.from(DATA_SETS.keys()); }

  get activeDataSourceName(): string { return this._activeDataSourceName; }
  set activeDataSourceName(value: string) {
    this._dataSource.data = DATA_SETS.get(value);
    this._activeDataSourceName = value;
  }
  private _activeDataSourceName = 'TEST_DATA';

  _dataSource = new DtFilterFieldDefaultDataSource(TEST_DATA);

  filterChanges(event: any): void {
    console.log(event);
  }
}
