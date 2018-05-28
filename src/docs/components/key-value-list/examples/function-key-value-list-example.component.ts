import { Component } from '@angular/core';
import { DtKeyValueList } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: '<dt-key-value-list [key]="key1"  [val]="value1" [dataSource]="dataSource1"></dt-key-value-list>',
})
export class FunctionKeyValueListExampleComponent {
  dataSource1: object[] = [
    { key : 'Process 1', value : 0.90 },
    { key : 'Process 2', value : 0.08 },
    { key : 'Process 3', value : 0.01 },
    { key : 'Process 4', value : 0.01 }
  ];
  key1: string = 'key';
  value1: Function = (valueObject: object) => {
    return (valueObject.value * 100) + "%";
  };
} 
