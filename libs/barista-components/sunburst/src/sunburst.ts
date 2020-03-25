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
 * assign colors
 * theme or generic palette
 * fillSeries should add a root element so value is not calculated all the time
 * initial input
 * overlay
 * labels
 * sizing of slices when selecting
 * add percentage
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
  filterActiveNodes,
  getAllNodes,
  getSelectedNodes,
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

  allNodes;
  filteredNodes;

  selectedLabel;
  selectedValue;

  @HostListener('click', ['$event']) onClick(ev: MouseEvent): void {
    this.select(ev);
  }

  @Input() series: DtSunburstNode[];
  @Input() selected: DtSunburstNode[];
  @Input() noSelectionLabel: string;
  @Input() valueDisplayMode: DtSunburstValueMode = DtSunburstValueMode.ABSOLUTE;

  @Output() selectedChange: EventEmitter<DtSunburstNode[]> = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if ('series' in changes) {
      this.filledSeries = fillSeries(this.series);
      this.filteredNodes = this.allNodes = getAllNodes(this.filledSeries);
      this.select();
    }
  }

  select(event?: MouseEvent, node?: DtSunburstSlice): void {
    if (event) event.stopPropagation();

    if (node) {
      this.selectNode(node);
    } else {
      this.selectAll();
    }
  }

  private selectNode(node: DtSunburstSlice): void {
    const selected = getSelectedNodes(this.series, node.data);

    this.selectedChange.emit(selected);

    this.filteredNodes = filterActiveNodes(this.allNodes.slice(), node.data.id);

    this.selectedLabel = node.data.label;
    this.selectedValue = node.data.value;
  }

  private selectAll(): void {
    this.selectedChange.emit(undefined);

    this.filteredNodes = this.allNodes;

    this.selectedLabel = this.noSelectionLabel;
    this.selectedValue = getValue(this.filledSeries);
  }
}
