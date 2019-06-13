import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-context-dialog-ui',
  templateUrl: 'context-dialog-ui.html',
})
export class ContextDialogUI {
  disabled = false;
  clickCounter = 0;
}
