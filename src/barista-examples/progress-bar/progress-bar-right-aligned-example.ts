import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `<dt-progress-bar [value]="30" [align]='"end"'></dt-progress-bar>`,
})
export class ProgressBarRightAlignedExample { }
