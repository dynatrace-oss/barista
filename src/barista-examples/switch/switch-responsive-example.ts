import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  // tslint:disable-next-line: max-line-length
  template:
    '<dt-switch>Enable automatic updates. If you enable automatic updates, updates will be done automatically. The system checks for updates every 15 minutes.</dt-switch>',
})
export class SwitchResponsiveExample {}
