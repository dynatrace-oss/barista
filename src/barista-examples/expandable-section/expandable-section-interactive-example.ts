import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-expandable-section #section [disabled]="sectionDisabled">
  <dt-expandable-section-header>My header text</dt-expandable-section-header>
  {{ text }}
</dt-expandable-section>
<button dt-button (click)="section.open()" [disabled]="section.expanded || sectionDisabled">Open</button>
<button dt-button (click)="section.close()" [disabled]="!section.expanded || sectionDisabled">Close</button>
<button dt-button (click)="section.toggle()" [disabled]="sectionDisabled">Toggle</button>
<button dt-button (click)="sectionDisabled = !sectionDisabled">Disable / Enable</button>`,
})
export class InteractiveExpandableSectionExample {
  text = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
  dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;
  sectionDisabled = false;
}
