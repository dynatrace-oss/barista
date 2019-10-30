import { Component } from '@angular/core';

import { DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components/filter-field';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      label="Filter by"
    ></dt-filter-field>
  `,
})
export class FilterFieldUniqueExample {
  private DATA = {
    autocomplete: [
      {
        name: 'Unique address',
        suggestions: [],
        unique: true,
      },
      {
        name: 'Address',
        suggestions: [],
      },
      {
        name: 'Unique Requests per minute',
        range: {
          operators: {
            range: true,
            equal: true,
            greaterThanEqual: true,
            lessThanEqual: true,
          },
          unit: 's',
          unique: true,
        },
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);
}
