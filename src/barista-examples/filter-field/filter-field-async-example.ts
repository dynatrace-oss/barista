import { Component } from '@angular/core';
import {
  DtFilterFieldDefaultDataSource,
  DtFilterFieldCurrentFilterChangeEvent,
} from '@dynatrace/angular-components/filter-field';

// tslint:disable: no-any

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      (currentFilterChanges)="currentFilterChanged($event)"
      label="Filter by"
    >
    </dt-filter-field>
  `,
})
export class FilterFieldAsyncExample {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT (async)',
        async: true,
        autocomplete: [],
      },
      {
        name: 'USA',
        autocomplete: ['San Francisco', 'Los Angeles', 'New York'],
      },
    ],
  };

  private ASYNC_DATA = {
    name: 'AUT (async)',
    autocomplete: ['Linz', 'Vienna', 'Graz'],
  };

  _dataSource = new DtFilterFieldDefaultDataSource<any>(this.DATA);

  currentFilterChanged(
    event: DtFilterFieldCurrentFilterChangeEvent<any>
  ): void {
    if (event.added[0] === this.DATA.autocomplete[0]) {
      // Emulate a http request
      setTimeout(() => {
        this._dataSource.data = this.ASYNC_DATA;
      }, 1000);
    }
  }
}
