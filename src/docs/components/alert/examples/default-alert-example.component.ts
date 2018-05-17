import { Component } from '@angular/core';
import {LoremIpsum} from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: '<dt-alert severity="warning">{{text}}</dt-alert>',
})
export class DefaultAlertExampleComponent {
  text = LoremIpsum
}
