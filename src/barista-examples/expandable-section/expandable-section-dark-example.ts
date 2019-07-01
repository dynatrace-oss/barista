import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<div class="dark" dtTheme=":dark">
  <dt-expandable-section>
    <dt-expandable-section-header>My header text</dt-expandable-section-header>
    Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et
    dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
    Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.
  </dt-expandable-section>
</div>`,
})
export class DarkExpandableSectionExample {}
