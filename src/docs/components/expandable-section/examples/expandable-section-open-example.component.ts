import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-section #section1 [opened]="true">
    <dt-expandable-section-header>My header text</dt-expandable-section-header>
  {{ text }}
</dt-expandable-section>`
})
export class OpenExpandableSectionExampleComponent {
  text = LoremIpsum.paragraph1
}
