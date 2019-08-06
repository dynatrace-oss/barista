import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'default-demo',
  template: `
    <dt-empty-state>
      <dt-empty-state-item>
        <dt-empty-state-item-img>
          <img src="/assets/cta-noagent.svg" alt="No agent" />
        </dt-empty-state-item-img>

        <dt-empty-state-item-title>Optional Heading</dt-empty-state-item-title>

        Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
        eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
        voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      </dt-empty-state-item>
    </dt-empty-state>
  `,
})
export class EmptyStateDefaultExample {}
