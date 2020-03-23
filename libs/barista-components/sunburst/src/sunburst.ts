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
 * theme
 * initial input
 * overlay
 * labels
 * sizing of slices when selecting
 *
 *
 *
 */

import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  ViewEncapsulation,
  OnInit,
  EventEmitter,
  HostListener,
} from '@angular/core';
import {
  getAllNodes,
  PiePoint,
  getFullPath,
  getKeyNamePairs,
  filterActiveNodes,
} from './sunburst-chart.util';

@Component({
  selector: 'dt-sunburst',
  templateUrl: 'sunburst.html',
  styleUrls: ['sunburst.scss'],
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtSunburst implements OnInit {
  _viewBox = '-100 -100 200 200';
  _width = '200';

  allNodes;
  filteredNodes;

  @HostListener('click', ['$event']) onClick(ev: MouseEvent): void {
    this.select(ev);
  }

  @Input() data: PiePoint[];
  @Input() selectedPath: PiePoint[];

  @Output() selectedPathChange: EventEmitter<PiePoint> = new EventEmitter();
  @Output() selectedPairsChange: EventEmitter<string[][]> = new EventEmitter();

  ngOnInit(): void {
    this.filteredNodes = this.allNodes = getAllNodes(this.data);
    console.log(this.allNodes);
  }

  select(event: MouseEvent, node?): void {
    event.stopPropagation();

    if (node) {
      const selectedPath = getFullPath(this.data, node.data);
      this.selectedPathChange.emit(selectedPath);
      this.selectedPairsChange.emit(getKeyNamePairs(selectedPath));

      this.filteredNodes = filterActiveNodes(
        this.allNodes.slice(),
        node.data.id,
      );
    } else {
      this.selectedPathChange.emit(undefined);
      this.selectedPairsChange.emit(undefined);

      this.filteredNodes = this.allNodes;
    }
  }
}
