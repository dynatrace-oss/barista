import { Component } from '@angular/core';

import { DtOverlayConfig } from '@dynatrace/angular-components/overlay';

@Component({
  selector: 'overlay-dev-app-demo',
  templateUrl: './overlay-demo.component.html',
  styleUrls: ['./overlay-demo.component.scss'],
})
export class OverlayDemo {
  config: DtOverlayConfig = {
    pinnable: true,
    originY: 'center',
  };
}
