import { NgModule } from '@angular/core';

import { DocsTableComponent } from './docs-table.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtTableModule } from '@dynatrace/angular-components/table';

import { DefaultTableExampleComponent } from './examples/table-default-example.component';
import { EmptyTableExampleComponent } from './examples/table-empty-state.component';

const EXAMPLES = [
    DefaultTableExampleComponent,
    EmptyTableExampleComponent,
];

@NgModule({
    imports: [
        CommonModule,
        UiModule,
        DtThemingModule,
        DtTableModule,
    ],
    exports: [
        DocsTableComponent,
    ],
    declarations: [
        ...EXAMPLES,
        DocsTableComponent,
    ],
    entryComponents: [
        ...EXAMPLES,
    ],
})
export class DocsTableModule { }
