import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-section #section1>
    <dt-expandable-section-header>My header text</dt-expandable-section-header>
  {{ text }}
</dt-expandable-section><br>
  <button dt-button (click)="section1.open()">Open</button>
  <button dt-button (click)="section1.close()">Close</button>
  <button dt-button (click)="section1.toggle()">Toggle</button>`
})
export class InteractiveExpandableSectionExampleComponent {
  text = LoremIpsum.paragraph1
}
