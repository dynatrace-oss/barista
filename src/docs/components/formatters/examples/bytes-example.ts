import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `
  <span>Example value:</span>
  <input dtInput #value [(ngModel)]="exampleValue"/>
  <br><br>
  <span>Formatted string:</span>
  {{ exampleValue | dtBytes }}
  <br><br>
  <span>Formatted string:</span>
  {{ exampleValue | dtBytes:1024 }}
  `,
  styles: [`
    span, input {
      width: 150px;
      display: inline-block;
    }
  `],
})
@OriginalClassName('BytesPipeExample')
export class BytesExample {
  exampleValue: number;
}
