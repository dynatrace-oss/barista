import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import {DtPaginationModule, DtButtonModule, DtThemingModule} from '@dynatrace/angular-components';
import { DefaultPaginationExampleComponent } from './examples/default-pagination-example.component';
import {ManyPaginationExampleComponent} from './examples/many-pagination-example.component';
import {DarkThemePaginationExampleComponent} from './examples/darktheme-pagination-example.component';

export const EXAMPLES = [
  DefaultPaginationExampleComponent,
  ManyPaginationExampleComponent,
  DarkThemePaginationExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtThemingModule,
    DtPaginationModule,
    DtButtonModule,
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
export class DocsPaginationModule {
}
