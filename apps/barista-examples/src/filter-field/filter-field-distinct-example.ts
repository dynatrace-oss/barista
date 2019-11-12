import { Component } from '@angular/core';

import { DtFilterFieldDefaultDataSource } from '@dynatrace/barista-components/filter-field';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      label="Filter by"
      clearAllLabel="Clear all"
    ></dt-filter-field>
  `,
})
export class FilterFieldDistinctExample {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: ['Linz', 'Vienna', 'Graz'],
        distinct: true,
      },
      {
        name: 'USA',
        autocomplete: ['San Francisco', 'Los Angeles', 'New York'],
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
