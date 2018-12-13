import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  template: `<dt-expandable-panel #panel1>
  {{ text }}
</dt-expandable-panel>
<button dt-button (click)="panel1.toggle()">Toggle</button>`,
})
@OriginalClassName('DefaultExpandablePanelExampleComponent')
export class DefaultExpandablePanelExampleComponent {
  text = `Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
  dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore
  magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
  Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.`;
}
