import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  templateUrl: 'buttongroup-example.component.html',
})
export class ButtongroupExampleComponent {
  
  groupValues: string[] = ['Performance', 'Connectivity', 'Failure rate'];
  groupValues2: { key: string, name: string }[] = [
    { key: 'perf', name: 'Performance' },
    { key: 'conn', name: 'Connectivity' },
    { key: 'fail', name: 'Failure rate' },
    { key: 'av', name: 'Availability' },
    { key: 'c', name: 'CPU' },
  ];
  colors = [
    { name: 'Default', key: null },
    { name: 'Warning', key: 'warning' },
    { name: 'Call to action', key: 'cta' },
  ];
}
