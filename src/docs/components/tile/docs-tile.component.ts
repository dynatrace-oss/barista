import { Component } from '@angular/core';
import { DefaultTileExampleComponent } from './examples/default-tile-example.component';
import { SmallTileExampleComponent } from './examples/small-tile-example.component';
import { RecoveredTileExampleComponent } from './examples/recovered-tile-example.component';
import { ErrorTileExampleComponent } from './examples/error-tile-example.component';
import { MainTileExampleComponent } from './examples/main-tile-example.component';
import { DisabledTileExampleComponent } from './examples/disabled-tile.example.component';

@Component({
  moduleId: module.id,
  selector: 'docs-tile',
  templateUrl: './docs-tile.component.html',
})
export class DocsTileComponent {

  examples = {
    default: DefaultTileExampleComponent,
    small: SmallTileExampleComponent,
    recovered: RecoveredTileExampleComponent,
    error: ErrorTileExampleComponent,
    main: MainTileExampleComponent,
    disabled: DisabledTileExampleComponent,
  };
}
