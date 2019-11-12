import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

let nextUniqueId = 0;

@Component({
  selector: 'dt-loading-distractor',
  exportAs: 'dtLoadingDistractor',
  templateUrl: 'loading-distractor.html',
  styleUrls: ['loading-distractor.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtLoadingDistractor {
  /** @internal The generated label id. */
  _labelId = `"dt-loading-distractor-label-${nextUniqueId++}`;
}
