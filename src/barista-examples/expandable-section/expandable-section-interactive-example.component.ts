import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-section #section1 [disabled]="section1disabled">
    <dt-expandable-section-header>My header text</dt-expandable-section-header>
  {{ text }}
</dt-expandable-section><br>
  <button dt-button (click)="section1.open()">Open</button>
  <button dt-button (click)="section1.close()">Close</button>
  <button dt-button (click)="section1.toggle()">Toggle</button>
  <button dt-button (click)="section1disabled = !section1disabled">Disabled / Enable</button>`,
})
@OriginalClassName('InteractiveExpandableSectionExampleComponent')
export class InteractiveExpandableSectionExampleComponent {
  text = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
  dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;
  section1disabled = false;
}
