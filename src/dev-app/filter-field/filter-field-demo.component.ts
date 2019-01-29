import { Component } from '@angular/core';
import { EXAMPLE_DATA } from './data';
import { KUBERNETES_DATA } from './kubernetes-data';
import { DtActiveFilterChangeEvent, DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components';

const DATA_SETS = new Map<string, any>([['EXAMPLE_DATA', EXAMPLE_DATA],['KUBERNETES_DATA', KUBERNETES_DATA]])

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
  private _activeDataSourceName = 'EXAMPLE_DATA';

  _dataSource = new DtFilterFieldDefaultDataSource(EXAMPLE_DATA);

}
