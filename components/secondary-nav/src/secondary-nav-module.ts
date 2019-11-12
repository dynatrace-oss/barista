import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtExpandablePanelModule } from '@dynatrace/barista-components/expandable-panel';
import {
  DtSecondaryNav,
  DtSecondaryNavTitle,
  DtSecondaryNavLink,
} from './secondary-nav';
import {
  DtSecondaryNavSection,
  DtSecondaryNavSectionTitle,
  DtSecondaryNavSectionDescription,
} from './section/secondary-nav-section';
import { DtSecondaryNavGroup } from './section/secondary-nav-group';

const EXPORTED_DECLARATIONS = [
  DtSecondaryNav,
  DtSecondaryNavTitle,
  DtSecondaryNavSection,
  DtSecondaryNavSectionTitle,
  DtSecondaryNavSectionDescription,
  DtSecondaryNavLink,
  DtSecondaryNavGroup,
];

@NgModule({
  imports: [CommonModule, RouterModule, DtIconModule, DtExpandablePanelModule],
  exports: [...EXPORTED_DECLARATIONS],
  declarations: [...EXPORTED_DECLARATIONS],
})
export class DtSecondaryNavModule {}
