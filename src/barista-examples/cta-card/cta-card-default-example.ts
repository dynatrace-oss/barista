import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
    <div class="demo-card">
      <dt-cta-card>
        <dt-cta-card-title i18n
          >Start monitoring your Cloud Foundry foundation VMs</dt-cta-card-title
        >
        <dt-cta-card-footer-actions>
          <a dt-button color="cta" i18n>View release</a>
        </dt-cta-card-footer-actions>
        <dt-cta-card-image
          ><img src="/assets/cta-noagent.svg"
        /></dt-cta-card-image>
        Deploy Dynatrace OneAgent via the Dynatrace OneAgent BOSH release to
        your Cloud Foundry foundation VMs. Get monitoring insights into all
        Cloud Foundry components including Diego cells, Gorouters, and more.
        Benefit from automatic monitoring of Cloud Foundry applications, down to
        the code and query level, thanks to built-in auto-injection for
        Garden-runC containers.
        <a class="dt-link" color="cta">Read more...</a>
      </dt-cta-card>
    </div>
  `,
})
export class CtaCardDefaultExample {}
