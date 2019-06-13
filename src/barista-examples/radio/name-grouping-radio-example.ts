import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-radio-button value="aberfeldy" name="group">Aberfeldy</dt-radio-button>
  <dt-radio-button value="dalmore" name="group">Dalmore</dt-radio-button>
  `,
  styles: ['dt-radio-button { display: block; } dt-radio-button + dt-radio-button { margin-top: 20px; }'],
})
export class NameGroupingRadioExample { }
