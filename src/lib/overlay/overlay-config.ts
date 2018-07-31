  // tslint:disable:no-inferrable-types

export class DtOverlayConfig {
  /** enables pinning the overlay */
  pinnable?: boolean = false;

  /** Constrains movement along an axis */
  movementConstraint?: 'xAxis' | 'yAxis';

  /**
   * Defines the anchor position of the origin element
   * depending on the size of the element sometimes using the center as an anchor is better suited
   * by default the bottom edge and top edge are used as the originY depending on where the overlay can be placed
   */
  verticalAnchor?: 'edge' | 'center' = 'center';
}
