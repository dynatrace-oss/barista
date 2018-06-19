import { Component } from '@angular/core';
import { DtTag } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `
<div>
  <dt-tag [removable]="canRemove" [disabled]="disabled" [value]="value1" (removed)="doRemove(tag1)" #tag1 title="My custom tooltip">
    <dt-tag-key *ngIf="hasKey">[AWS]OSType:</dt-tag-key>
    Windows
  </dt-tag>
  <dt-tag [removable]="canRemove" [disabled]="disabled" [value]="value2" (removed)="doRemove(tag2)" #tag2 title="Another tooltip">
    <dt-tag-key *ngIf="hasKey">[AWS]Category:</dt-tag-key>
    Managed
  </dt-tag>
</div>
<button dt-button (click)="canRemove=!canRemove" [variant]="canRemove ? 'primary' : 'secondary'">Toggle removable</button>
<button dt-button (click)="disabled=!disabled" [variant]="disabled ? 'primary' : 'secondary'">Toggle disabled</button>
<button dt-button (click)="hasKey=!hasKey" [variant]="hasKey ? 'primary' : 'secondary'">Toggle key</button>
  `,
})
export class InteractiveTagExampleComponent {

  value1 = 'My value 1';
  value2 = 'My value 2';
  disabled = false;
  canRemove = false;
  hasKey = false;

  doRemove(tag: DtTag<string>): void {
    window.alert(`Tag removed: ${tag.value}`);
  }
}
