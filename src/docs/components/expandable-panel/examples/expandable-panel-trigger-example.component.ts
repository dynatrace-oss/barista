import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1>
  Example panel
</dt-expandable-panel>
<br>
<div [dtExpandablePanel]="panel1" #trigger1="dtExpandablePanelTrigger">
Toggle trigger (<span *ngIf="trigger1.opened">Close</span><span *ngIf="!trigger1.opened">Open</span>)
</div>`,
  styles: [`.dt-expandable-panel-trigger span {color: green} .dt-expandable-panel-trigger-open span {color: #ddd}`],
})
export class TriggerExpandablePanelExampleComponent {}
