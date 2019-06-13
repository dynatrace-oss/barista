import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-button-ui',
  templateUrl: 'button-ui.html',
})
export class ButtonUI {
  isDisabled = false;
  clickCounter = 0;
}
