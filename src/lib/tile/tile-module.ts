import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DtTile, DtTileTitle, DtTileSubtitle, DtTileIcon } from './tile';

@NgModule({
  imports: [CommonModule],
  exports: [DtTile, DtTileTitle, DtTileSubtitle, DtTileIcon],
  declarations: [DtTile, DtTileTitle, DtTileSubtitle, DtTileIcon],
})
export class DtTileModule {}
