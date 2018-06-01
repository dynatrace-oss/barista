import { Component } from '@angular/core';
import { LOREM_IPSUM } from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1>
  {{ text }}
</dt-expandable-panel>
<button dt-button (click)="panel1.toggle()">Toggle</button>`,
})
export class DefaultExpandablePanelExampleComponent {
  text = LOREM_IPSUM;
}
