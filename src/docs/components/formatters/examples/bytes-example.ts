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
  <span>1024:</span>
  {{ exampleValue | dtBytes:1024 }}
  <br><br>
  <span>kB:</span>
  {{ exampleValue | dtKilobytes }}
  <br><br>
  <span>MB:</span>
  {{ exampleValue | dtMegabytes }}
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
