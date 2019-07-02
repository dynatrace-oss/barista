import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
  <dt-bar-indicator value="60" [color]="color"></dt-bar-indicator>
  <dt-button-group [value]="color" (valueChange)="changed($event)" style="margin-top: 16px">
    <dt-button-group-item value="main">main</dt-button-group-item>
    <dt-button-group-item value="error">error</dt-button-group-item>
    <dt-button-group-item value="recovered">recovered</dt-button-group-item>
  </dt-button-group>
  `,
})
export class BarIndicatorColorExample {
  color = 'error';

  changed(colorValue: string): void {
    this.color = colorValue;
  }
}
