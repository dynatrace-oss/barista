import { Component } from '@angular/core';

@Component({
  selector: 'dt-button-ui',
  templateUrl: 'button-ui.html',
})
export class ButtonUI {
  isDisabled = false;
  clickCounter = 0;
}
