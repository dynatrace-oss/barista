import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {DtExpandablePanelTrigger} from '@dynatrace/angular-components/expandable-panel';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1>
  Example panel
</dt-expandable-panel>
<br>
<div [dtExpandablePanel]="panel1">Toggle</div>`,
})
export class TriggerSimpleExpandablePanelExampleComponent {}
