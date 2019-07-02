import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `<div>
  <dt-alert severity="error" #alert1>This is a message!</dt-alert>
</div>
<button dt-button (click)="alert1.severity='warning'">Set Warning</button>
<button dt-button (click)="alert1.severity='error'">Set Error</button>
  `,
})
export class AlertInteractiveExample {
}
