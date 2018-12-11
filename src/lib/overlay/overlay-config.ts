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

  /** @internal Positiones passed to the overlay if you need to override the default positioning system */
  _positions?: ConnectedPosition[];

  /** Data passed to the overlay as the $implicit context object */
  // tslint:disable-next-line:no-any
  data?: any;
}
