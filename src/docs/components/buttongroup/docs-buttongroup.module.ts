import { NgModule } from '@angular/core';
import { ButtongroupExampleComponent } from './examples/buttongroup-example.component';
import { DocsButtongroupComponent } from './docs-buttongroup.component';
import { UiModule } from '../../ui/ui.module';
import { DtButtonModule } from '@dynatrace/angular-components/button';
import { DtButtongroupModule } from '@dynatrace/angular-components/buttongroup';
import { CommonModule } from '@angular/common';

const EXAMPLES = [
  ButtongroupExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtButtonModule,
    DtButtongroupModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsButtongroupComponent,
  ],
  exports: [
    DocsButtongroupComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsButtongroupModule {
}
