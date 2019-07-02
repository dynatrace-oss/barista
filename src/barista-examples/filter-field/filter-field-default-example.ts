import { Component } from '@angular/core';
import { DtFilterFieldDefaultDataSource } from '@dynatrace/angular-components/filter-field';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-filter-field
    [dataSource]="_dataSource"
    label="Filter by">
  </dt-filter-field>
  `,
})
export class FilterFieldDefaultExample {

  private TEST_DATA = {
    autocomplete: [
      {
        name: 'Kubernetes Labels',
        options: [
          {
            name: 'beta.kubernetes.io/arch',
            value: 'beta.kubernetes.io/arch',
            autocomplete: ['amd64', 'amd32'],
            distinct: true,
          },
          {
            name: 'beta.kubernetes.io/os',
            value: 'beta.kubernetes.io/os',
            autocomplete: ['linux', 'windows'],
            distinct: true,
          },
          {
            name: 'node-role.kubernetes.io/master (simple label)',
            value: 'node-role.kubernetes.io/master',
          },
        ],
      },
      {
        name: 'Node',
        options: [
          {
            name: 'Custom Simple Option',
          },
          {
            name: 'Node Label',
            key: 'MyKey',
            suggestions: [
              'some cool',
              'very weird',
            ],
          },
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

  _dataSource = new DtFilterFieldDefaultDataSource(this.TEST_DATA);

}
