/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtEventChartColors,
  DtEventChartLegendItem,
} from './event-chart-directives';
import { RenderEvent } from './render-event.interface';

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

  /** Input for the consumer defined legend-items. */
  @Input() legendItems: DtEventChartLegendItem[];

  /** @internal List that holds the actually rendered eventChartLegendItems. */
  _renderLegendItems: {
    color: string;
    item: DtEventChartLegendItem;
    pattern: boolean;
  }[];

  constructor(private _changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(): void {
    this._updateRenderLegendItems();
  }

  /**
   * Updates the legend item objects that are actually rendered.
   * These items are a filtered subset of the one provided by the consumer.
   * Additionally the correct color is set for each one.
   */
  _updateRenderLegendItems(): void {
    // To calculate the legend items that we would need to display
    // we need to iterate over the renderedEvents and determine, which
    // elements are actually needed.
    // Dataset will look like this neededLegends[lane][pattern][color];
    const neededLegends: Array<Array<DtEventChartColors[]>> = [];
    const legendItems = new Set<DtEventChartLegendItem>();

    for (const renderEvent of this.renderedEvents) {
      const currentLane = renderEvent.lane;
      // We are taking the pattern definition from the renderEvent itself.
      // Primarily this is handled by the lane defining this event.
      const pattern = renderEvent.pattern ? 'pattern' : 'no-pattern';
      const color = renderEvent.color;
      // Check if we have a dataset for the current lane already, otherwise assign one.
      neededLegends[currentLane] = neededLegends[currentLane] || [];
      // Check if we have a dataset for the current lane and duration combination,
      // otherwise create one.
      neededLegends[currentLane][pattern] =
        neededLegends[currentLane][pattern] || [];
      // Check if we have a dataset for the current lane, duration and color combination,
      // otherwise create one.
      neededLegends[currentLane][pattern][color] =
        neededLegends[currentLane][pattern][color] || false;
      // If we have have already found a legend item for this combination
      // don't look for another
      if (!neededLegends[currentLane][pattern][color]) {
        const selectedLegendItem = this.legendItems.find(
          (item) =>
            item.lanes.includes(currentLane) &&
            item.pattern === renderEvent.pattern &&
            item.color === color,
        );
        if (selectedLegendItem) {
          neededLegends[currentLane][pattern][color] = true;
          legendItems.add(selectedLegendItem);
        }
      }
    }

    this._renderLegendItems = Array.from(legendItems).map((item) => ({
      item,
      color: item.color,
      pattern: item.pattern,
    }));
    this._changeDetectorRef.markForCheck();
  }
}
