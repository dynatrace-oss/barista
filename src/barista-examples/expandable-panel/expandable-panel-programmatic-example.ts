import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-expandable-panel #panel [expanded]="true">
  {{ text }}
</dt-expandable-panel>
<button dt-button (click)="panel.toggle()">Toggle panel</button>
<button dt-button (click)="panel.open()" [disabled]="panel.expanded">Open panel</button>
<button dt-button (click)="panel.close()" [disabled]="!panel.expanded">Close panel</button>`,
})
export class ExpandablePanelProgrammaticExample {
  text = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
  dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;
}
