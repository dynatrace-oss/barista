import { NgModule } from '@angular/core';
import { UiModule } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { DtTileModule, DtThemingModule } from '@dynatrace/angular-components';
import { DocsTileComponent } from './docs-tile.component';
import { DefaultTileExampleComponent } from './examples/default-tile-example.component';
import { SmallTileExampleComponent } from './examples/small-tile-example.component';
import { RecoveredTileExampleComponent } from './examples/recovered-tile-example.component';
import { ErrorTileExampleComponent } from './examples/error-tile-example.component';
import { MainTileExampleComponent } from './examples/main-tile-example.component';
import { DisabledTileExampleComponent } from './examples/disabled-tile.example.component';

const EXAMPLES = [
  DefaultTileExampleComponent,
  SmallTileExampleComponent,
  RecoveredTileExampleComponent,
  ErrorTileExampleComponent,
  MainTileExampleComponent,
  DisabledTileExampleComponent,
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
