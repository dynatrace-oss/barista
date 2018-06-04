import { Component } from '@angular/core';
import { DtKeyValueList } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `<dt-key-value-list columns="2">
      <dt-key-value-list-item *ngFor="let entry of entries" [key]="entry.key" [value]="entry.value"></dt-key-value-list-item>
</dt-key-value-list>`,
})
export class LongtextKeyValueListExampleComponent {
  entries: object[] = [
    { key : 'Hostname (Public)', value : 'ec25217103181.eu-west1.compute.amazon-aws.com' },
    { key : 'Hostname (Private)', value : 'ip-1723129141.eu-west-1.compute.internal' },
    { key : 'Instance Type', value : 'm3.medium' },
    { key : 'Availability Zone', value : 'eu-west-1a' },
    { key : 'AMI', value : 'ami-f12ab886' },
    { key : 'Virtualization', value : 'Xen' },
    { key : 'Instance', value : 'i-53f0d1b7' },
    { key : 'Architecture', value : 'x68,64-bit' }
  ];
} 
