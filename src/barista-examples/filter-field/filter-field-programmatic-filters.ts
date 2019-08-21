import { Component } from '@angular/core';

import { DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components/filter-field';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <dt-filter-field
      [dataSource]="_dataSource"
      [filters]="_filters"
      label="Filter by"
    ></dt-filter-field>
  `,
})
export class FilterFieldProgrammaticFiltersExample {
  private DATA = {
    autocomplete: [
      {
        name: 'AUT',
        autocomplete: ['Linz', 'Vienna', 'Graz'],
      },
      {
        name: 'USA',
        autocomplete: [
          'San Francisco',
          'Los Angeles',
          'New York',
          { name: 'Custom', suggestions: [] },
        ],
      },
      {
        name: 'Requests per minute',
        range: {
          operators: {
            range: true,
            equal: true,
            greaterThanEqual: true,
            lessThanEqual: true,
          },
          unit: 's',
        },
      },
    ],
  };

  _dataSource = new DtFilterFieldDefaultDataSource(this.DATA);

  _filters = [
    // Filter AUT -> Vienna
    [this.DATA.autocomplete[0], this.DATA.autocomplete[0].autocomplete![1]],

    // Filter USA -> Custom -> Miami
    [
      this.DATA.autocomplete[1],
      this.DATA.autocomplete[1].autocomplete![3],
      'Miami',
    ],
  ];
}
