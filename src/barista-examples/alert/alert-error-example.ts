import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: '<dt-alert severity="error">This is an error message!</dt-alert>',
})
export class AlertErrorExample {}
