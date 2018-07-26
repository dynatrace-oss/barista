import {
  OverlayConfig,
} from '@angular/cdk/overlay';

export class DtOverlayConfig extends OverlayConfig {
  enableMouseMove?: boolean;
  enablePin?: boolean;

  constructor(config?: OverlayConfig) {
    super(config);
  }
}
