import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-section>
    <dt-expandable-section-header>My <span style="color: red;">custom</span> header text</dt-expandable-section-header>
  {{ text }}
</dt-expandable-section>`
})
export class CustomStylingExpandableSectionExampleComponent {
  text = LoremIpsum.paragraph1
}
