import { Component, ViewChild } from '@angular/core';

import { DtExpandablePanel } from '@dynatrace/angular-components/expandable-panel';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <div>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
    </div>
    <dt-expandable-panel #panel>
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
      diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
      erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
      rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum
      dolor sit amet.
    </dt-expandable-panel>
    <button
      dt-show-more
      [showLess]="panel.expanded"
      (click)="panel.expanded ? panel.close() : panel.open()"
      aria-label-show-less="Collapse content"
    >
      Show more
    </button>
  `,
})
export class ShowMoreToggleExample {
  @ViewChild(DtExpandablePanel, { static: true })
  panel: DtExpandablePanel;
}
