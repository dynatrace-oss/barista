import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  QueryList,
} from '@angular/core';

import { DT_DRAWER_CONTAINER } from './drawer';
import { DtDrawerContainer } from './drawer-container';
import { DtSidenav } from './sidenav';

@Component({
  moduleId: module.id,
  selector: 'dt-sidenav-container',
  exportAs: 'dtSidenavContainer',
  templateUrl: 'drawer-container.html',
  styleUrls: ['drawer-container.scss'],
  host: {
    class: 'dt-drawer-container dt-sidenav-container',
    '(keydown)': '_handleKeyboardEvent($event)',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: DT_DRAWER_CONTAINER,
      useExisting: DtSidenavContainer,
    },
  ],
})
export class DtSidenavContainer extends DtDrawerContainer {
  @ContentChildren(DtSidenav) protected _drawers: QueryList<DtSidenav>;
}
