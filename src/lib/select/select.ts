import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-select',
  exportAs: 'dtSelect',
  templateUrl: 'select.html',
  styleUrls: ['select.scss'],
  host: {
    class: 'dt-select',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSelect {

}
