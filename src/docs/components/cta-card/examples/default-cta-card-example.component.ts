import { Component } from '@angular/core';
import { OriginalClassName } from '../../../core/decorators';

@Component({
  moduleId: module.id,
  template: `<div class="demo-card">
    <dt-cta-card>
    <dt-cta-card-title i18n>Start monitoring your Cloud Foundry foundation VMs</dt-cta-card-title>
    <dt-cta-card-action>
      <a target="_blank"
         dt-button
         color="cta"
         uitestid="viewReleaseLink"
         i18n>View release</a>
    </dt-cta-card-action>
    <dt-cta-card-image><img src="/assets/cta-noagent.svg"></dt-cta-card-image>
    <span i18n>
      Deploy Dynatrace OneAgent via the Dynatrace OneAgent BOSH release to your Cloud Foundry foundation VMs. 
      Get monitoring insights into all Cloud Foundry components including Diego cells, Gorouters, and more. 
      Benefit from automatic monitoring of Cloud Foundry applications, down to the code and query level, thanks to built-in auto-injection for Garden-runC containers.
      <a class="dt-link" color="cta" i18n>Read more...</a>
    </span>
  </dt-cta-card>
  </div>`,
})
@OriginalClassName('DefaultCtaCardExampleComponent')
export class DefaultCtaCardExampleComponent { }
