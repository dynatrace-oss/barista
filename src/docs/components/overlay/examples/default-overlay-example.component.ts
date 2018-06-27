import { Component } from '@angular/core';

// enum DtOverlayScrollStrategy {Block, Close, Reposition}
// enum DtOverlayCloseStrategy {Disable, Enable}
// enum DtOverlayMovementConstraint {X, Y}

// export interface DtOverlayConfig {
//   scrollStrategy: DtOverlayScrollStrategy;
//   scrollCloseStrategy: DtOverlayCloseStrategy;
//   movementStrategy: DtOverlayMovementConstraint;
//   enableClick: boolean;
//   enableMouseMove: boolean;
//   enableFocus: boolean;
// }

@Component({
  moduleId: module.id,
  template: `
    <button [dtOverlayTrigger]="overlayId1">Open</button>
    <dt-overlay-container #overlayId1>
      <p>Overlay content 1</p>
    </dt-overlay-container>
  `,
})
export class DefaultOverlayExampleComponent {

  // public dtOverlayConfig: DtOverlayConfig;

  // constructor(){
  //   this.dtOverlayConfig = {
  //     scrollStrategy: DtOverlayScrollStrategy.Reposition,
  //     scrollCloseStrategy: DtOverlayCloseStrategy.Disable,
  //     movementStrategy: DtOverlayMovementConstraint.X,
  //     enableClick: true,
  //     enableMouseMove: true,
  //     enableFocus: true,
  //   }
  // }

}
