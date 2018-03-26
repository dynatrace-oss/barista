import {Component} from '@angular/core';

@Component({
  selector: 'button-ui',
  templateUrl: 'button-ui.html',
})
export class ButtonUI {
  isDisabled: boolean = false;
  clickCounter: number = 0;
}
