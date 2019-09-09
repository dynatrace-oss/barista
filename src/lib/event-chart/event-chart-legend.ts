import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  QueryList,
  ViewEncapsulation,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators';

import { RenderEvent } from './event-chart';
import {
  DtEventChartColors,
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
export class DtEventChartLegend<T> implements OnChanges {
  /** Has all rendered events to determine which legend labels should be shown. */
  @Input() renderedEvents: RenderEvent<T>[];

  /**
   * Input for the QueryList of the consumer defined legend-items.
   * We need to listen to changes within these defined legend-items, to react
   * on changing legend-items. The consumer defined items are used to
   * determine which legend-items need to be rendered in the
   * _updateRenderlegend-items function.
   */
  @Input()
  get legendItems(): QueryList<DtEventChartLegendItem> {
    return this._legendItems;
  }
  set legendItems(value: QueryList<DtEventChartLegendItem>) {
    this._legendItemSubscription.unsubscribe();
    this._legendItems = value;
    this._legendItemSubscription = value
      ? this._legendItems.changes.pipe(startWith(null)).subscribe(() => {
          this._updateRenderLegendItems();
        })
      : Subscription.EMPTY;
  }
  private _legendItems: QueryList<DtEventChartLegendItem>;
  private _legendItemSubscription = Subscription.EMPTY;

  /** @internal List that holds the actually rendered eventChartLegendItems. */
  _renderLegendItems: { color: string; item: DtEventChartLegendItem }[];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this._updateRenderLegendItems();
  }

  /**
   * Updates the legend item objects that are actually rendered.
   * These items are a filtered subset of the one provided by the consumer.
   * Additionally the correct color is set for each one.
   */
  private _updateRenderLegendItems(): void {
    // To calculate the legend items that we would need to display
    // we need to iterate over the renderedEvents and determine, which
    // elements are actually needed.
    // Dataset will look like this neededLegends[lane][hasDuration][color];
    const neededLegends: Array<Array<DtEventChartColors[]>> = [];
    const legendItems = new Set<DtEventChartLegendItem>();

    for (const renderEvent of this.renderedEvents) {
      const currentLane = renderEvent.lane;
      const hasDuration = renderEvent.x1 === renderEvent.x2 ? 0 : 1;
      const color = renderEvent.color;
      // Check if we have a dataset for the current lane already, otherwise assign one.
      neededLegends[currentLane] = neededLegends[currentLane] || [];
      // Check if we have a dataset for the current lane and duration combination,
      // otherwise create one.
      neededLegends[currentLane][hasDuration] =
        neededLegends[currentLane][hasDuration] || [];
      // Check if we have a dataset for the current lane, duration and color combination,
      // otherwise create one.
      neededLegends[currentLane][hasDuration][color] =
        neededLegends[currentLane][hasDuration][color] || false;
      // If we have have already found a legend item for this combination
      // don't look for another
      if (!neededLegends[currentLane][hasDuration][color]) {
        const selectedLegendItem = this.legendItems.find(
          item =>
            item.lanes.includes(currentLane) &&
            item.hasDuration === !!hasDuration &&
            item.color === color,
        );
        if (selectedLegendItem) {
          neededLegends[currentLane][hasDuration][color] = true;
          legendItems.add(selectedLegendItem);
        }
      }
    }

    this._renderLegendItems = Array.from(legendItems).map(item => ({
      item,
      color: item.color,
    }));
    this._changeDetectorRef.markForCheck();
  }
}
