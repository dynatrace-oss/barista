import { NgModule } from '@angular/core';
import { UiModule, COMPONENT_EXAMPLES } from '../../ui/ui.module';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { DtTileModule, DtThemingModule, DtIconModule } from '@dynatrace/angular-components';
import { DefaultTileExampleComponent } from './examples/default-tile-example.component';
import { SmallTileExampleComponent } from './examples/small-tile-example.component';
import { RecoveredTileExampleComponent } from './examples/recovered-tile-example.component';
import { ErrorTileExampleComponent } from './examples/error-tile-example.component';
import { MainTileExampleComponent } from './examples/main-tile-example.component';
import { DisabledTileExampleComponent } from './examples/disabled-tile.example.component';

export const EXAMPLES = [
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
    HttpClientModule,
    DtIconModule,
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
export class DocsTileModule {
}
