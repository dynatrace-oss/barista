import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtTileModule, DtThemingModule } from '@dynatrace/angular-components';
import { DocsTileComponent } from './docs-tile.component';
import { DefaultTileExampleComponent } from './examples/default-tile-example.component';
import { SmallTileExampleComponent } from './examples/small-tile-example.component';
import { RecoveredTileExampleComponent } from './examples/recovered-tile-example.component';

const EXAMPLES = [
  DefaultTileExampleComponent,
  SmallTileExampleComponent,
  RecoveredTileExampleComponent,
];

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    DtTileModule,
    DtThemingModule,
  ],
  declarations: [
    ...EXAMPLES,
    DocsTileComponent,
  ],
  exports: [
    DocsTileComponent,
  ],
  entryComponents: [
    ...EXAMPLES,
  ],
})
export class DocsTileModule {
}
