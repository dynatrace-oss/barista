import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DtTile, DtTileIcon, DtTileSubtitle, DtTileTitle } from './tile';

@NgModule({
  imports: [CommonModule],
  exports: [DtTile, DtTileTitle, DtTileSubtitle, DtTileIcon],
  declarations: [DtTile, DtTileTitle, DtTileSubtitle, DtTileIcon],
})
export class DtTileModule {}
