import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-tile-ui',
  templateUrl: 'tile-ui.html',
})
export class TileUI {
  isDisabled = false;
  clickCounter = 0;
}
