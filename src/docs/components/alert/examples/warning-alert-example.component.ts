import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: '<dt-alert severity="warning">This is a warning message!</dt-alert>',
})
@OriginalClassName('WarningAlertExampleComponent')
export class WarningAlertExampleComponent {
}
