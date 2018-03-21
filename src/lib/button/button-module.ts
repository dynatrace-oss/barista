import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {A11yModule} from '@angular/cdk/a11y';
import {GhButton, GhAnchor} from './button';

@NgModule({
  imports: [
    CommonModule,
    A11yModule
  ],
  exports: [
    GhButton,
    GhAnchor
  ],
  declarations: [
    GhButton,
    GhAnchor
  ]
})
export class GhButtonModule {}
