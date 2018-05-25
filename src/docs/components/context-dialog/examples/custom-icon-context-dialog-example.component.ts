import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `
  <div class="light" dtTheme=":light">
  <dt-context-dialog>
    <dt-context-dialog-icon><dt-icon [name]="name"></dt-icon></dt-context-dialog-icon>
  <div>Example Content</div>
  </dt-context-dialog>
    <button (click)="name = 'abort'">{{name}}</button>
  </div>`,
})
export class CustomIconContextDialogExampleComponent {
  name = 'agent';
}
