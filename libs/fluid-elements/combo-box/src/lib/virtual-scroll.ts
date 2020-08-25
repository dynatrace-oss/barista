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

export interface VirtualScrollOptions<T extends {}> {
  items: (T & { renderFn?: (...args: any[]) => string })[];
  renderFn: (...args: any[]) => string;
  startIndex?: number;
  nodePadding?: number;
}

export interface VirtualScrollItem {
  index: number;
  height?: number;
  visible: boolean;
  fragment: DocumentFragment;
  renderFn: (...args: any) => string;
}

const DEFAULT_START_INDEX = 0;
const DEFAULT_NODE_PADDING = 1;

export class VirtualScroll {
  /** Index of the item to start scrolling at */
  startIndex = 0;

  /** Index of the topmost currently visible item */
  currentIndex = 0;

  /** Nodes to pre-render outside of the visible content */
  nodePadding = 3;

  constructor(options: VirtualScrollOptions<any>) {
    const { startIndex, nodePadding } = options;
    this.startIndex = startIndex ? startIndex : DEFAULT_START_INDEX;
    this.nodePadding = nodePadding ? nodePadding : DEFAULT_NODE_PADDING;
  }
}

// tslint:disable: jsdoc-format
/**

 WeakMap for items
 const items: { [key: number]: VItem };

render function returning document fragment instead of string
to be able to register event listeners

 1. render first 10 items
 2. get container height (parent that holds the items)
 3. 10 items.reduce(prev, {height} => prev =+ height, 0);
 4. if space left -> render next + 3 weitere (calculate avg. height)  and append
    4.1 calc avg. height
    4.2 check how much left + 3 avg in offset


    ... wait for scroll

  on scroll ->

    avg.height -> 3 rendern und recyclen


    [item]
    [item]
    [item]
    ------
    [item]
    [item]
    ------
    [item]
    [item]
    [item]

*/
