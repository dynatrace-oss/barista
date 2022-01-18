/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { FlatTreeControl, TreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { isDefined } from '../util';

/**
 * Tree flattener to convert a normal type of node to node with children & level information.
 * Transform nested nodes of type `T` to flattened nodes of type `F`.
 *
 * For example, the input data of type `T` is nested, and contains its children data:
 *
 * @example
 *   SomeNode: {
 *     key: 'Fruits',
 *     children: [
 *       NodeOne: {
 *         key: 'Apple',
 *       },
 *       NodeTwo: {
 *        key: 'Pear',
 *      }
 *    ]
 *  }
 *  After flattener flatten the tree, the structure will become
 *  SomeNode: {
 *    key: 'Fruits',
 *    expandable: true,
 *    level: 1
 *  },
 *  NodeOne: {
 *    key: 'Apple',
 *    expandable: false,
 *    level: 2
 *  },
 *  NodeTwo: {
 *   key: 'Pear',
 *   expandable: false,
 *   level: 2
 * }
 * and the output flattened type is `F` with additional information.
 */
export class DtTreeFlattener<T, F> {
  constructor(
    private transformFunction: (node: T, level: number) => F,
    private getLevel: (node: F) => number,
    private isExpandable: (node: F) => boolean,
    private getChildren: (node: T) => Observable<T[]> | T[] | undefined | null,
  ) {}

  private _flattenNode(
    node: T,
    level: number,
    resultNodes: F[],
    parentMap: boolean[],
  ): F[] {
    const flatNode = this.transformFunction(node, level);
    resultNodes.push(flatNode);

    if (this.isExpandable(flatNode)) {
      const childrenNodes = this.getChildren(node);
      if (isDefined(childrenNodes)) {
        if (Array.isArray(childrenNodes)) {
          this._flattenChildren(childrenNodes, level, resultNodes, parentMap);
        } else {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          childrenNodes!.pipe(take(1)).subscribe((children) => {
            this._flattenChildren(children, level, resultNodes, parentMap);
          });
        }
      }
    }
    return resultNodes;
  }

  private _flattenChildren(
    children: T[],
    level: number,
    resultNodes: F[],
    parentMap: boolean[],
  ): void {
    children.forEach((child, index) => {
      const childParentMap: boolean[] = parentMap.slice();
      childParentMap.push(index !== children.length - 1);
      this._flattenNode(child, level + 1, resultNodes, childParentMap);
    });
  }

  /**
   * Flatten a list of node type T to flattened version of node F.
   * Please note that type T may be nested, and the length of `structuredData` may be different
   * from that of returned list `F[]`.
   */
  flattenNodes(structuredData: T[]): F[] {
    const resultNodes: F[] = [];
    structuredData.forEach((node) =>
      this._flattenNode(node, 0, resultNodes, []),
    );
    return resultNodes;
  }

  /**
   * Expand flattened node with current expansion status.
   * The returned list may have different length.
   */
  expandFlattenedNodes(nodes: F[], treeControl: TreeControl<F>): F[] {
    const results: F[] = [];
    const currentExpand: boolean[] = [];
    currentExpand[0] = true;

    nodes.forEach((node: F) => {
      let expand = true;
      for (let i = 0; i <= this.getLevel(node); i++) {
        expand = expand && currentExpand[i];
      }
      if (expand) {
        results.push(node);
      }
      if (this.isExpandable(node)) {
        currentExpand[this.getLevel(node) + 1] = treeControl.isExpanded(node);
      }
    });
    return results;
  }
}

/**
 * Data source for flat tree structure.
 * The data source need to handle expansion/collapsion of the tree node and change the data feed
 * to `DtTree` or `DtTreeTable`.
 * The nested tree nodes of type `T` are flattened through `DtTreeFlattener`, and converted
 * to type `F` for `DtTree` pr `DtTreeTable` to consume.
 */
export class DtTreeDataSource<T, F> extends DataSource<F> {
  /** @internal Subject that emits the flattened data */
  _flattenedData = new BehaviorSubject<F[]>([]);

  /** @internal Subject that emits the expanded data */
  _expandedData = new BehaviorSubject<F[]>([]);

  /** @internal Subject that emits the actual data */
  _data: BehaviorSubject<T[]>;
  /** The data for the datasource */
  get data(): T[] {
    return this._data.value;
  }
  set data(value: T[]) {
    this._data.next(value);
    this._flattenedData.next(this.treeFlattener.flattenNodes(this.data));
    this.treeControl.dataNodes = this._flattenedData.value;
  }

  constructor(
    private treeControl: FlatTreeControl<F>,
    private treeFlattener: DtTreeFlattener<T, F>,
    initialData: T[] = [],
  ) {
    super();
    this._data = new BehaviorSubject<T[]>(initialData);
  }

  /** Connects the datasource */
  connect(collectionViewer: CollectionViewer): Observable<F[]> {
    const changes = [
      collectionViewer.viewChange,
      this.treeControl.expansionModel.changed,
      this._flattenedData,
    ];
    return merge(...changes).pipe(
      map(() => {
        this._expandedData.next(
          this.treeFlattener.expandFlattenedNodes(
            this._flattenedData.value,
            this.treeControl,
          ),
        );
        return this._expandedData.value;
      }),
    );
  }

  /** Noop */
  disconnect(): void {}
}
