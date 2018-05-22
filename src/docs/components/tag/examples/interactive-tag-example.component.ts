import {Component, ViewChild} from '@angular/core';
import { DtTag } from '@dynatrace/angular-components';

@Component({
  moduleId: module.id,
  template: `
<div>
  <dt-tag [removable]="canRemove" [disabled]="disabled" [interactive]="interactive" [value]="value1" (removed)="doRemove(tag1)" #tag1>
    <dt-tag-key *ngIf="hasKey">[AWS]OSType:</dt-tag-key>
    Windows
  </dt-tag>
  <dt-tag [removable]="canRemove" [disabled]="disabled" [interactive]="interactive" [value]="value2" (removed)="doRemove(tag2)" #tag2>
    <dt-tag-key *ngIf="hasKey">[AWS]Category:</dt-tag-key>
    Managed
  </dt-tag>
</div>
<button dt-button (click)="canRemove=!canRemove" [variant]="canRemove ? 'primary' : 'secondary'">Toggle removable</button>
<button dt-button (click)="disabled=!disabled" [variant]="disabled ? 'primary' : 'secondary'">Toggle disabled</button>
<button dt-button (click)="interactive=!interactive" [variant]="interactive ? 'primary' : 'secondary'">Toggle interactive</button>
<button dt-button (click)="hasKey=!hasKey" [variant]="hasKey ? 'primary' : 'secondary'">Toggle key</button>
  `,
})
export class InteractiveTagExampleComponent {

  value1 = 'My value 1';
  value2 = 'My value 2';

  doRemove(tag: DtTag<string>): void {
    window.alert('Tag removed: ' + tag.value);
  }
}
