import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-context-dialog aria-label="Show more actions" aria-label-close-button="Close context dialog">
  <button dt-button>First button</button>
  <button dt-button variant="secondary">Second button</button>
  <button dt-button variant="secondary">Third button</button>
</dt-context-dialog>`,
  styles: [
    `::ng-deep .dt-context-dialog-content {
      display: flex;
      flex-direction: column;
      align-items: stretch;
    }
    .dt-button + .dt-button {
      margin-top: 8px;
    }
    `,
  ],
})
export class ContextActionsDialogExampleComponent {
}
