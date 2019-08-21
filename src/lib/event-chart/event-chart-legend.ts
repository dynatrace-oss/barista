import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';

import {
  DtEventChartLane,
  DtEventChartLegendItem,
} from './event-chart-directives';

/** @internal */
@Component({
  selector: 'dt-event-chart-legend',
  exportAs: 'dtEventChartLegend',
  templateUrl: './event-chart-legend.html',
  styleUrls: ['./event-chart-legend.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtEventChartLegend implements OnChanges {
  /** */
  @Input() lanes: DtEventChartLane[] = [];
  /** */
  @Input() legendItems: DtEventChartLegendItem[] = [];

  /** @internal */
  _renderLegendItems: { color: string; item: DtEventChartLegendItem }[];

  ngOnChanges(): void {
    this._updateRenderLegendItems();
  }

  /**
   * Updates the legend item objects that are actually rendered.
   * These items are a filtered subset of the one provided by the consumer.
   * Additionally the correct color is set for each one.
   */
  private _updateRenderLegendItems(): void {
    const items = this.legendItems.filter(item => {
      const itemLanes = Array.isArray(item.lanes) ? item.lanes : [item.lanes];
      return itemLanes.some(itemLane =>
        Boolean(this.lanes.find(lane => itemLane === lane.name)),
      );
    });

    // Apply the correct color based on the color of the first name connected to the item
    this._renderLegendItems = items.map(item => ({
      item,
      color: this.lanes.find(lane => lane.name === item.lanes[0])!.color,
    }));
  }
}
