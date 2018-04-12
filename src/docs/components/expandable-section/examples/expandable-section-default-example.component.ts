import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-section #section1>
  {{ text }}
</dt-expandable-section>
<button dt-button (click)="section1.toggle()">Toggle</button>`
})
export class DefaultExpandableSectionExampleComponent {
  text = LoremIpsum.paragraph1
}
