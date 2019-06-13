import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-component',
  template: `
<dt-tile disabled="true">
  <dt-tile-icon><dt-icon name="agent"></dt-icon></dt-tile-icon>
  <dt-tile-title>L-W8-64-APMDay3</dt-tile-title>
  <dt-tile-subtitle>Linux (x84, 64-bit)</dt-tile-subtitle>
  Network traffic
</dt-tile>`,
})
export class DisabledTileExampleComponent { }
