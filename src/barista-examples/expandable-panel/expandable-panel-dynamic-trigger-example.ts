import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-expandable-panel #panel>
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
  dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
</dt-expandable-panel>
<button dt-button [dtExpandablePanel]="panel">
 Toggle trigger (<span *ngIf="panel.expanded">close panel</span><span *ngIf="!panel.expanded">open panel</span>)
</button>`,
})
export class ExpandablePanelDynamicTriggerExample {}
