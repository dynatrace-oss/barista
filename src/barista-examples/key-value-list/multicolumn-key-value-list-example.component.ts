import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `<dt-key-value-list>
  <dt-key-value-list-item *ngFor="let entry of entries">
    <strong dtKeyValueListKey>{{ entry.key }}</strong>
    <samp dtKeyValueListValue>{{ entry.value }}</samp>
  </dt-key-value-list-item>
</dt-key-value-list>`,
})
export class MulticolumnKeyValueListExampleComponent {
  entries: object[] = [
    { key : 'Temp', value : '28C' },
    { key : 'Temp1', value : '27C' },
    { key : 'Temp2', value : '24C' },
    { key : 'Temp3', value : '29C' },
    { key : 'Temp4', value : '22C' },
    { key : 'Temp5', value : '21C' },
    { key : 'Temp6', value : '25C' },
    { key : 'Temp7', value : '29C' },
    { key : 'Temp8', value : '30C' },
    { key : 'Temp9', value : '22C' },
    { key : 'Temp10', value : '26C' },
    { key : 'Temp11', value : '21C' },
    { key : 'Temp12', value : '32C' },
    { key : 'Temp13', value : '25C' },
    { key : 'Temp14', value : '19C' },
    { key : 'Temp15', value : '24C' },
    { key : 'Temp16', value : '27C' },
    { key : 'Temp17', value : '21C' },
    { key : 'Temp18', value : '28C' },
    { key : 'Temp19', value : '33C' },
    { key : 'Temp20', value : '26C' },
  ];
}
