import { Component } from '@angular/core';

enum DtOverlayScrollStrategy {Block, Close, Reposition}
enum DtOverlayCloseStrategy {Disable, Enable}
enum DtOverlayMovementStrategy {X, Y}

export interface DtOverlayConfig {
  scrollStrategy: DtOverlayScrollStrategy;
  scrollCloseStrategy: DtOverlayCloseStrategy;
  movementStrategy: DtOverlayMovementStrategy;
  enableClick: boolean;
  enableMouseMove: boolean;
  enableFocus: boolean;
}

@Component({
  moduleId: module.id,
  template: `
    <button [dtOverlayTrigger]="overlayId1">Open</button>
    <dt-overlay [dtOverlayConfig]="dtOverlayConfig" #overlayId1>
      <p>Overlay content 1</p>
    </dt-overlay>

    <button [dtOverlayTrigger]="overlayId2">Open</button>
    <dt-overlay [dtOverlayConfig]="dtOverlayConfig" #overlayId2>
      <p>Overlay content 2</p>
    </dt-overlay>
  `,
})
export class DefaultOverlayExampleComponent {

  public dtOverlayConfig: DtOverlayConfig;

  constructor(){
    this.dtOverlayConfig = {
      scrollStrategy: DtOverlayScrollStrategy.Reposition,
      scrollCloseStrategy: DtOverlayCloseStrategy.Disable,
      movementStrategy: DtOverlayMovementStrategy.X,
      enableClick: true,
      enableMouseMove: true,
      enableFocus: true,
    }
  }

}
