import { Component } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-radio-ui',
  templateUrl: 'radio-ui.html',
})
export class RadioUI {
  isGroupDisabled = false;
  groupValue: string;
}
