/**
 * @license
 * Copyright 2020 Dynatrace LLC
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

/**
 *
 *
 * TODO
 *
 * theme or generic palette
 * fillSeries should add a root element so value is not calculated all the time
 * initial selection should show actual label and value
 * overlay
 * labels
 * sizing of slices when selecting
 * add percentage
 * unify id creation
 *
 *
 */

import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import {
  DtSunburstNode,
  DtSunburstNodeInternal,
  DtSunburstSlice,
  DtSunburstValueMode,
  fillSeries,
  getNodesWithState,
  getSelectedId,
  getSelectedNodes,
  getSlices,
  getValue,
} from './sunburst.util';

@Component({
  selector: 'dt-sunburst',
  templateUrl: 'sunburst.html',
  styleUrls: ['sunburst.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSunburst implements OnChanges {
  _viewBox = '-100 -100 200 200';
  _width = '200';

  filledSeries: DtSunburstNodeInternal[];
  slices: DtSunburstSlice[];

  _selected: DtSunburstNode[];
  selectedLabel: string;
  selectedValue: number;

  @HostListener('click', ['$event']) onClick(ev: MouseEvent): void {
    this.select(ev);
  }

  @Input() series: DtSunburstNode[];
  @Input() selected: DtSunburstNode[];
  @Input() noSelectionLabel: string;
  @Input() valueDisplayMode: DtSunburstValueMode = DtSunburstValueMode.ABSOLUTE;

  @Output() selectedChange: EventEmitter<DtSunburstNode[]> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    // console.log(changes);

    if (changes.series?.currentValue !== changes.series?.previousValue) {
      console.info('SERIES updated');
      this.filledSeries = fillSeries(this.series);
      this.render();
    }
    if (changes.selected?.currentValue !== changes.selected?.previousValue) {
      console.info('SELECTED updated');
      this._selected = this.selected;
      this.render();
    }
  }

  select(event: MouseEvent, slice?: DtSunburstSlice): void {
    event.stopPropagation();

    if (slice) {
      this._selected = getSelectedNodes(this.filledSeries, slice.data);

      this.selectedChange.emit(this._selected);
    } else {
      this._selected = [];

      this.selectedChange.emit(undefined);
    }

    this.render();
  }

  private render(): void {
    const nodesWithState = getNodesWithState(
      this.filledSeries,
      getSelectedId(this.filledSeries, this._selected),
    );
    this.slices = getSlices(nodesWithState);

    if (this._selected && this._selected.length) {
      this.selectedLabel = this._selected.slice(-1)[0].label ?? '';
      this.selectedValue = this._selected.slice(-1)[0].value ?? 0;
    } else {
      this.selectedLabel = this.noSelectionLabel;
      this.selectedValue = getValue(this.filledSeries);
    }
  }
}
