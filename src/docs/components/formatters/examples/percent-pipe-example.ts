import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <span>Example value:</span>
  <input dtInput #value [(ngModel)]="exampleValue"/>
  <br><br>
  <span>Formatted string:</span>
  {{ exampleValue | dtPercent }}
  `,
  styles: [`
    span, input {
      width: 150px;
      display: inline-block;
    }
  `],
})
@OriginalClassName('PercentPipeExample')
export class PercentPipeExample {
  exampleValue: number;
}
