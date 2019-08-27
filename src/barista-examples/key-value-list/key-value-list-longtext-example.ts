import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'component-barista-example',
  template: `
    <dt-key-value-list>
      <dt-key-value-list-item *ngFor="let entry of entries">
        <dt-key-value-list-key>{{ entry.key }}</dt-key-value-list-key>
        <dt-key-value-list-value>{{ entry.value }}</dt-key-value-list-value>
      </dt-key-value-list-item>
    </dt-key-value-list>
  `,
})
export class KeyValueListLongtextExample {
  entries: object[] = [
    {
      key: 'Hostanem in Amazon AWS Region EU-West 1 (public access)',
      value: 'ec25217103181.eu-west1.compute.amazon-aws.com',
    },
    {
      key: 'Hostname (Public)',
      value: 'ec25217103181.eu-west1.compute.amazon-aws.com',
    },
    {
      key: 'Hostname (Private)',
      value: 'ip-1723129141.eu-west-1.compute.internal',
    },
    { key: 'Instance Type', value: 'm3.medium' },
    { key: 'Availability Zone', value: 'eu-west-1a' },
    { key: 'AMI', value: 'ami-f12ab886' },
    { key: 'Virtualization', value: 'Xen' },
    { key: 'Instance', value: 'i-53f0d1b7' },
    { key: 'Architecture', value: 'x68,64-bit' },
    {
      key: '2. Hostname (Public)',
      value: 'ec25217103181.eu-west1.compute.amazon-aws.com',
    },
    {
      key: '2. Hostname (Private)',
      value: 'ip-1723129141.eu-west-1.compute.internal',
    },
    { key: '2. Instance Type', value: 'm3.medium' },
    { key: '2. Availability Zone', value: 'eu-west-1a' },
    { key: '2. AMI', value: 'ami-f12ab886' },
    { key: '2. Virtualization', value: 'Xen' },
    { key: '2. Instance', value: 'i-53f0d1b7' },
    { key: '2. Architecture', value: 'x68,64-bit' },
  ];
}
