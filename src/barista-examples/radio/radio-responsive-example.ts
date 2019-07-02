import { Component } from '@angular/core';

// tslint:disable:max-line-length
@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-radio-group name="newsletter">
    <dt-radio-button value="opt-in">Yes, I want to receive a weekly newsletter, because I like emails a lot.</dt-radio-button>
    <dt-radio-button value="opt-out">No, I don't want to receive a weekly newsletter, because I don't like them at all. I don't like to read so many emails every week.</dt-radio-button>
  </dt-radio-group>
  `,
  styles: ['dt-radio-button { display: block; } dt-radio-button + dt-radio-button { margin-top: 20px; }'],
})
export class RadioResponsiveExample { }
// tslint:enable:max-line-length
