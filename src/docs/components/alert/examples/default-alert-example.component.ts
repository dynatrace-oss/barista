import { Component } from '@angular/core';
import { LOREM_IPSUM } from '../../../core/lorem-ipsum';

@Component({
  moduleId: module.id,
  template: '<dt-alert severity="warning">{{text}}</dt-alert>',
})
export class DefaultAlertExampleComponent {
  text = LOREM_IPSUM;
}
