import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1 [opened]="true">
  {{ text }}
</dt-expandable-panel>
<br>
<button dt-button (click)="panel1.open()">Open</button><button dt-button (click)="panel1.close()">Close</button>`,
})
export class OpenExpandablePanelExampleComponent {
  text = LoremIpsum.paragraph1
}
