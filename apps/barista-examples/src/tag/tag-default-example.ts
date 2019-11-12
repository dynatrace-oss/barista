import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-tag-list aria-label="test">
      <dt-tag>window</dt-tag>
      <dt-tag>deploy</dt-tag>
      <dt-tag>.NetTest</dt-tag>
      <dt-tag>193.168.4.3:80</dt-tag>
      <dt-tag><dt-tag-key>Maxk</dt-tag-key>loadtest</dt-tag>
      <dt-tag>sdk-showroom</dt-tag>
      <dt-tag>dt</dt-tag>
      <dt-tag>requests</dt-tag>
      <dt-tag>cluster</dt-tag>
      <dt-tag>server</dt-tag>
      <dt-tag>node</dt-tag>
    </dt-tag-list>
  `,
})
export class TagDefaultExample {}
