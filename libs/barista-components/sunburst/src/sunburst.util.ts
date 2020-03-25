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

import {
  DtColors,
  DT_CHART_COLOR_PALETTE_ORDERED,
} from '@dynatrace/barista-components/theming';
import * as d3 from 'd3-shape';

export interface DtSunburstNode {
  filterKey: string;
  filterValue: string | number | boolean;
  label: string;
  value?: number;
  children?: DtSunburstNode[];
}

export enum DtSunburstValueMode {
  ABSOLUTE = 'absolute',
  PERCENT = 'percent',
}

export interface DtSunburstNodeInternal extends DtSunburstNode {
  id: string;
  value: number;
  children?: DtSunburstNodeInternal[];

  // number of children
  depth: number;
  color: string;
}

export interface DtSunburstSlice
  extends d3.PieArcDatum<DtSunburstNodeInternal> {}

const innerRadius = 50;
const outerRadius = 100;
const idSeparator = '.';

export const getAllNodes = (
  series: DtSunburstNodeInternal[],
): DtSunburstSlice[] => {
  const numLevels = series.reduce(
    (maxLevel, point) => Math.max(maxLevel, point.depth),
    0,
  );

  return getNodesByParent(series, 1, numLevels);
};

export const getNodesByParent = (
  data: DtSunburstNodeInternal[],
  level: number,
  numLevels: number,
  startAngle: number = 0,
  endAngle: number = 2 * Math.PI,
): DtSunburstSlice[] => {
  const parsedData = d3
    .pie<DtSunburstNodeInternal>()
    .startAngle(startAngle)
    .endAngle(endAngle)
    .value(d => d.value ?? 0)(data);

  const radia = {
    innerRadius:
      ((level - 1) * (outerRadius - innerRadius)) / numLevels + innerRadius,
    outerRadius:
      (level * (outerRadius - innerRadius)) / numLevels + innerRadius,
  };

  return parsedData.reduce(
    (paths, segment) => [
      ...paths,
      {
        ...segment,
        visible: level === 1,
        path: d3.arc()({
          startAngle: segment.startAngle,
          endAngle: segment.endAngle,
          ...radia,
        }),
      },
      ...getNodesByParent(
        segment.data.children ?? [],
        level + 1,
        numLevels,
        segment.startAngle,
        segment.endAngle,
      ),
    ],
    [],
  );
};

export const fillSeries = (
  data: DtSunburstNode[],
  parent?: DtSunburstNodeInternal,
  color?: string,
): DtSunburstNodeInternal[] =>
  data
    .map((point, i) => {
      // fill id to give it to children
      let tmp: DtSunburstNodeInternal = {
        ...point,
        id: parent ? `${parent.id}${idSeparator}${i}` : `${i}`,
        depth: 1,
        value: point.value ?? 0,
        children: [],
        color: color ?? getColor(i, data.length),
      };
      // fill values for children and parent id
      tmp = {
        ...tmp,
        children:
          point.children && fillSeries(point.children, tmp, color ?? tmp.color),
      };

      return {
        // calculate the value once the children have it calculated
        ...tmp,
        depth: tmp.children
          ? 1 + Math.max(...tmp.children?.map(child => child.depth ?? 0))
          : 1,
        value: tmp.children ? getValue(tmp.children) : tmp.value ?? 0,
      };
    })
    .sort((a, b) => a.value - b.value);

export const filterActiveNodes = (
  all: DtSunburstSlice[],
  id: string,
): DtSunburstSlice[] =>
  all.map(node => ({
    ...node,
    data: {
      ...node.data,
      color:
        isAncestor(node.data, id) ||
        isCurrent(node.data, id) ||
        isChild(node.data, id)
          ? node.data.color
          : DtColors.GRAY_300,
    },
    active: isAncestor(node.data, id) || isCurrent(node.data, id),
    visible:
      // alway show first level
      getLevel(node.data.id) === 1 ||
      isAncestorSibling(node.data, id) ||
      isChild(node.data, id),
  }));

// PARSING
/**
 * @description Get selected path for the sunburst following the original data but with only one child per node
 * @param data Whole set of data
 * @param leaf Selected element
 * @returns Path for the sunburst with only one child per node
 */
export const getSelectedNodes = (
  data: DtSunburstNode[],
  leaf: DtSunburstNodeInternal,
): DtSunburstNode[] =>
  leaf.id.split(idSeparator, -1).reduce(
    (
      tree: {
        currentLevel: DtSunburstNode[];
        result: DtSunburstNode[];
      },
      key,
    ) => {
      const currentNode = tree.currentLevel[parseInt(key)];
      tree.result.push(currentNode);

      // update for next iteration
      if (currentNode.children) tree.currentLevel = currentNode.children;

      return tree;
    },
    {
      currentLevel: data,
      result: [],
    },
  ).result;

/**
 * @description Compacts sunburst output to the filter to be applied
 * @param data Output of sunburst, only one child per node
 * @returns Array of key, name pairs
 */
export const dtFlattenSunburstToFilter = (
  nodes: DtSunburstNode[],
): { [key: string]: string | number | boolean } =>
  nodes.reduce((filter, node) => {
    filter[node.filterKey] = node.filterValue;

    return filter;
  }, {});

// UTILS
export const getValue = (nodes: DtSunburstNode[]) =>
  nodes.reduce((total, p) => total + (p?.value ?? 0), 0);

const getLevel = (id: string): number => id.split(idSeparator).length;
// as sunburst is built backwards we must invert the colors too
const getColor = (i: number, totalSlices: number): string =>
  DT_CHART_COLOR_PALETTE_ORDERED[
    (totalSlices - i - 1) % DT_CHART_COLOR_PALETTE_ORDERED.length
  ];

const getAncestorsIds = (id: string): string[] =>
  id
    .split(idSeparator)
    .slice(0, -1)
    .map((_, i, segments) => segments.slice(0, i + 1).join(idSeparator));

// node is child of given id
const isChild = (node, id: string): boolean =>
  node.id.indexOf(id) === 0 && getLevel(node.id) === getLevel(id) + 1;

//  node is ancestor of given id
const isCurrent = (node, id: string): boolean => node.id === id;

//  node is ancestor of given id
const isAncestor = (node, id: string): boolean =>
  getAncestorsIds(id).some(i => node.id === i);

// node is parent of given id
const isAncestorSibling = (node, id: string): boolean =>
  getAncestorsIds(id).some(i => isChild(node, i));

// node is parent of given id
// const isParent = (node, id: string): boolean =>
//   id.split(idSeparator).slice(-1).join(idSeparator) === node.id;
