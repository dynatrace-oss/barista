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

  /**
   * @internal
   * Positions that override the default positions for the overlay
   */
  _positions?: ConnectedPosition[];

  /**
   * @internal
   * Dismiss the overlay on scroll
   */
  _dismissOnScroll?: boolean = true;

  /**
   * @internal
   * Wether a focus trap is created inside the overlay
   */
  _hasFocusTrap?: boolean = true;
}
