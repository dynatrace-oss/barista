import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'dt-breadcrumbs',
  templateUrl: 'breadcrumbs.html',
  styleUrls: ['breadcrumbs.scss'],
  host: {
    class: 'dt-breadcrumbs',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtBreadcrumbs {
}
