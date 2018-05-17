import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtIconModule } from '@dynatrace/angular-components';
import { DocsIconComponent } from './docs-icon.component';
import { DefaultIconExample } from './examples/icon-default-example';
import { HttpClientModule } from '@angular/common/http';

const EXAMPLES = [
  DefaultIconExample,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    HttpClientModule,
    DtIconModule.forRoot({ svgIconLocation: `/assets/icons/{{name}}.svg` }),
  ],
  declarations: [
    ...EXAMPLES,
    DocsIconComponent,
  ],
  exports: [
    DocsIconComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsIconModule {
}
