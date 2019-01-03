import { Component } from '@angular/core';

@Component({
  selector: 'key-value-list-demo',
  templateUrl: './key-value-list-demo.component.html',
  styleUrls: ['./key-value-list-demo.component.scss'],
})
export class KeyValueListDemo {
  entries: object[] = [
    { key : 'Temp', value : '28C' },
    { key : 'Temp1', value : '27C' },
    { key : 'Temp2', value : '24C' },
    { key : 'Temp3', value : '29C' },
    { key : 'Temp4', value : '22C' },
    { key : 'Temp5', value : '21C' },
    { key : 'Temp6', value : '25C' },
    { key : 'Temp7', value : '29C' },
  ];
}
