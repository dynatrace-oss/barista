import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ElementRef,
  Input
} from '@angular/core';

let nextUniqueId = 0;

@Component({
  moduleId: module.id,
  selector: 'dt-loading-spinner',
  exportAs: 'dtLoadingSpinner',
  templateUrl: 'loading-spinner.html',
  styleUrls: ['loading-spinner.scss'],
  host: {
    'role': 'progressbar',
    'aria-busy': 'true',
    'aria-live': 'assertive',
    '[attr.aria-label]': 'ariaLabel',
    '[attr.aria-labeledby]': 'ariaLabelledby',
  },
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtLoadingSpinner {
  // tslint:disable:no-input-rename
  @Input('aria-labelledby') ariaLabelledby: string;
  @Input('aria-label') ariaLabel: string;
  // tslint:enable:no-input-rename
}

@Component({
  moduleId: module.id,
  selector: 'dt-loading-distractor',
  exportAs: 'dtLoadingDistractor',
  templateUrl: 'loading-distractor.html',
  styleUrls: ['loading-distractor.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtLoadingDistractor {
  _labelId = `"dt-loading-distractor-label-${nextUniqueId++}`;
}
