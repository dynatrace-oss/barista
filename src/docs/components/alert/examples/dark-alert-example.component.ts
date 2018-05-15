import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: `<section class="dark" dtTheme=":dark">
  <dt-alert severity="warning">{{text}}</dt-alert>
</section>`,
})
export class DarkAlertExampleComponent {
  text = LoremIpsum
}
