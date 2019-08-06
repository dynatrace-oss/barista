import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'default-demo',
  template: `
    <dt-card>
      <dt-card-title>CTA card title</dt-card-title>

      <dt-card-title-actions>
        <button
          dt-icon-button
          variant="secondary"
          color="cta"
          aria-label="Close card"
        >
          <dt-icon name="abort"></dt-icon>
        </button>
      </dt-card-title-actions>

      <dt-empty-state>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          <dt-empty-state-item-title>
            Optional heading 1
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          <dt-empty-state-item-title>
            Optional heading 2
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
        <dt-empty-state-item>
          <dt-empty-state-item-img>
            <img src="/assets/cta-noagent.svg" alt="My Asset" />
          </dt-empty-state-item-img>

          <dt-empty-state-item-title>
            Optional heading 3
          </dt-empty-state-item-title>

          Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
          nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat,
          sed diam voluptua. At vero eos et accusam et justo duo dolores et ea
          rebum.
        </dt-empty-state-item>
      </dt-empty-state>

      <dt-card-footer-actions>
        <a dt-button color="cta" i18n>View release</a>
        <a dt-button color="cta" i18n>More info</a>
      </dt-card-footer-actions>
    </dt-card>
  `,
})
export class EmptyStateMultipleItemsInCardExample {}
