import { NgModule } from '@angular/core';
import { DefaultSwitchExampleComponent } from './examples/default-switch-example.component';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtSwitchModule, DtThemingModule } from '@dynatrace/angular-components';
import { DarkThemeSwitchExampleComponent } from './examples/dark-theme-switch-example.component';

export const EXAMPLES = [
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
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
  providers: [
    { provide: COMPONENT_EXAMPLES, useValue: EXAMPLES, multi: true },
  ],
})
export class DocsSwitchModule {
}
