import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1>
  Example panel
</dt-expandable-panel>
<br>
<div [dtExpandablePanel]="panel1">Toggle</div>`,
})
@OriginalClassName('TriggerSimpleExpandablePanelExampleComponent')
export class TriggerSimpleExpandablePanelExampleComponent {}
