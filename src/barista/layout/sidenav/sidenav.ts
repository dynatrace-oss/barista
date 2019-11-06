import { Component, Input } from '@angular/core';

@Component({
  selector: 'nav[ba-sidenav]',
  templateUrl: 'sidenav.html',
  styleUrls: ['sidenav.scss'],
  host: {
    class: 'ba-sidenav',
  },
})
export class BaSidenav {
  /** all sidenav items */
  @Input() sidenavData;
}
