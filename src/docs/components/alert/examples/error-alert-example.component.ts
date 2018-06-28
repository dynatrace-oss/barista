import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-alert severity="error">This is an error message!</dt-alert>',
})
@OriginalClassName('ErrorAlertExampleComponent')
export class ErrorAlertExampleComponent {
}
