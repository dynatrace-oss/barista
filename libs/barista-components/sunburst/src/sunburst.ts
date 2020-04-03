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
 * overlay
 * E2E
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
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodes,
  getSelectedNodesFromOutside,
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
  readonly width = 480;
  readonly viewBox = '-240 -176 480 352';

  filledSeries: DtSunburstNodeInternal[];
  slices: DtSunburstSlice[];

  _selected: DtSunburstNodeInternal[];
  selectedLabel: string;
  selectedValue: number;
  selectedRelativeValue: number;
  labelAsAbsolute: boolean = true;

  @HostListener('click', ['$event']) onClick(ev?: MouseEvent): void {
    this.select(ev);
  }

  @Input() series: DtSunburstNode[];
  @Input() selected: DtSunburstNode[];
  @Input() noSelectionLabel: string;
  @Input() valueDisplayMode: DtSunburstValueMode = DtSunburstValueMode.ABSOLUTE;

  @Output() selectedChange: EventEmitter<DtSunburstNode[]> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.series?.currentValue !== changes.series?.previousValue) {
      this.filledSeries = fillNodes(this.series);
      this.render();
    }

    if (changes.selected?.currentValue !== changes.selected?.previousValue) {
      this._selected = getSelectedNodesFromOutside(
        this.filledSeries,
        this.selected,
      );
      this.render();
    }

    if (
      changes.valueDisplayMode?.currentValue !==
      changes.valueDisplayMode?.previousValue
    ) {
      this.labelAsAbsolute =
        this.valueDisplayMode === DtSunburstValueMode.ABSOLUTE;
    }
  }

  select(event?: MouseEvent, slice?: DtSunburstSlice): void {
    event?.stopPropagation();

    if (slice) {
      this._selected = getSelectedNodes(this.filledSeries, slice.data);

      this.selectedChange.emit(this._selected.map(node => node.origin));
    } else {
      this._selected = [];

      this.selectedChange.emit([]);
    }

    this.render();
  }

  render(): void {
    const nodesWithState = getNodesWithState(
      this.filledSeries,
      getSelectedId(this.filledSeries, this._selected),
    );
    this.slices = getSlices(nodesWithState);

    if (this._selected && this._selected.length) {
      this.selectedLabel = this._selected.slice(-1)[0].label ?? '';
      this.selectedValue = this._selected.slice(-1)[0].value ?? 0;
      this.selectedRelativeValue =
        this._selected.slice(-1)[0].valueRelative ?? 0;
    } else {
      this.selectedLabel = this.noSelectionLabel;
      this.selectedValue = getValue(this.filledSeries);
      this.selectedRelativeValue = 1;
    }
  }
}
