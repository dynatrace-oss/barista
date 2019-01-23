import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <dt-info-group color="error">
    <dt-info-group-icon>  <dt-icon name="agent"></dt-icon></dt-info-group-icon>
    <dt-info-group-title>30%</dt-info-group-title>
    CPU
  </dt-info-group>`,
})
export class InfoGroupDemo { }
