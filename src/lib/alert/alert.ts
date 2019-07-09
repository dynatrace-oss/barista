import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-alert',
  templateUrl: 'alert.html',
  styleUrls: ['alert.scss'],
  host: {
    role: 'alert',
    class: 'dt-alert',
    '[class.dt-alert-warning]': 'severity === "warning"',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtAlert {
  /** The severity type of the alert. */
  @Input() severity: 'error' | 'warning' = 'error';
}
