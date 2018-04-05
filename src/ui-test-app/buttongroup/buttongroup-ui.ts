import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-buttongroup-ui',
  templateUrl: 'buttongroup-ui.html',
})
export class ButtongroupUI {
  isDisabled = false;
  clickCounter = 0;
}
