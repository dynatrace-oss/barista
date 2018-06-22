import { NgModule } from '@angular/core';
import { DefaultSwitchExampleComponent } from './examples/default-switch-example.component';
import { DocsSwitchComponent } from './docs-switch.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtSwitchModule, DtThemingModule } from '@dynatrace/angular-components';
import { DarkThemeSwitchExampleComponent } from './examples/dark-theme-switch-example.component';

const EXAMPLES = [
  DefaultSwitchExampleComponent,
  DarkThemeSwitchExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtSwitchModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsSwitchComponent,
  ],
  exports: [
    DocsSwitchComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsSwitchModule {
}
