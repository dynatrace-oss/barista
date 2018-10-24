import { ConnectedPosition } from '@angular/cdk/overlay';

  // tslint:disable:no-inferrable-types

export class DtOverlayConfig {
  /** enables pinning the overlay */
  pinnable?: boolean = false;

  /** Constrains movement along an axis */
  movementConstraint?: 'xAxis' | 'yAxis';

  /**
   * The originY defines the vertical attachment point for the overlay.
   * By default `center` is set. `edge` defines that the vertical attachment point is set to the bottom edge
   * if the overlay fits below the origin element and the top edge otherwise.
   */
  originY?: 'edge' | 'center' = 'center';
}
