import { NgModule } from '@angular/core';

import { DocsTableComponent } from './docs-table.component';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtThemingModule } from '@dynatrace/angular-components/theming';
import { DtTableModule } from '@dynatrace/angular-components/table';

@NgModule({
    imports: [DtTableModule],
    exports: [DocsTableComponent],
    declarations: [DocsTableComponent],
    providers: [],
})
export class DocsTableModule { }
