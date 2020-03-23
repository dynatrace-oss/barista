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

import * as d3 from 'd3-shape';

export interface PiePoint {
  key: string;
  name: string;
  value?: number;
  children?: PiePoint[];
}

interface PiePointInternal extends PiePoint {
  id: string;
  value: number;
  children?: PiePointInternal[];

  // number of children
  depth: number;
}

interface PieSlice extends d3.PieArcDatum<PiePointInternal> {
  color: string;
}

const innerRadius = 50;
const outerRadius = 100;
const idSeparator = '.';

export const getAllNodes = (data: PiePoint[]): PieSlice[] => {
  const filledValues = fillValues(data);
  const numLevels = filledValues.reduce(
    (maxLevel, point) => Math.max(maxLevel, point.depth),
    0,
  );

  return getNodesByParent(fillValues(data), 1, numLevels);
};

export const getNodesByParent = (
  data: PiePointInternal[],
  level: number,
  numLevels: number,
  startAngle: number = 0,
  endAngle: number = 2 * Math.PI,
): PieSlice[] => {
  const parsedData = d3
    .pie<PiePointInternal>()
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
        color: `hsl(${segment.value * 8},100%,50%)`,
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

// TODO: simplify into 1 map
const fillValues = (
  data: PiePoint[],
  parent?: PiePoint & { id: string },
): PiePointInternal[] => {
  return (
    data
      // fill id to give it to children
      .map((point, i) => ({
        ...point,
        id: parent ? `${parent.id}${idSeparator}${i}` : `${i}`,
      }))
      // fill values for children
      .map((point, i) => ({
        ...point,
        children: point.children && fillValues(point.children, point),
        active: false,
      }))
      // calculate the value once the children have it calculated
      .map(point => ({
        ...point,
        depth: point.children
          ? 1 + Math.max(...point.children?.map(child => child.depth ?? 0))
          : 1,
        value:
          point.children?.reduce((total, p) => total + (p?.value ?? 0), 0) ??
          point.value ??
          0,
      }))
  );
};

export const filterActiveNodes = (all: PieSlice[], id: string): PieSlice[] =>
  all.map(node => ({
    ...node,
    active: isAncestor(node.data, id),
    color: isAncestor(node.data, id) ? node.color : '#ccc',
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
export const getFullPath = (
  data: PiePoint[],
  leaf: PiePointInternal,
): PiePoint =>
  leaf.id.split(idSeparator, -1).reduce(
    (
      tree: {
        currentLevel: PiePoint[];
        lastInserted: PiePoint;
        result: PiePoint;
      },
      key,
    ) => {
      // calculate current node
      const currentNode = tree.currentLevel[parseInt(key)];

      tree.lastInserted.children = [
        {
          name: currentNode.name,
          key: currentNode.key,
        },
      ];

      // update for next iteration
      tree.lastInserted = tree.lastInserted.children[0];
      if (currentNode.children) tree.currentLevel = currentNode.children;

      // first iteration, save node
      if (!tree.result.name) tree.result = tree.lastInserted;

      return tree;
    },
    {
      currentLevel: data,
      lastInserted: {} as PiePoint,
      result: {} as PiePoint,
    },
  ).result;

/**
 * @description Compacts sunburst output to the filter to be applied
 * @param data Output of sunburst, only one child per node
 * @returns Array of key, name pairs
 */
export const getKeyNamePairs = (data: PiePoint): string[][] =>
  [
    data.key ? [data.key, data.name] : [],
    ...(data.children && data.children[0]
      ? getKeyNamePairs(data.children[0])
      : []),
  ].filter(pair => pair && pair.length);

// UTILS
const getLevel = (id: string): number => id.split(idSeparator).length;

const getAncestorsIds = (id: string): string[] =>
  id
    .split(idSeparator)
    .map((val, i, segments) => segments.slice(0, i + 1).join(idSeparator));

// node is child of given id
const isChild = (node, id: string): boolean =>
  node.id.indexOf(id) === 0 && getLevel(node.id) === getLevel(id) + 1;

//  node is ancestor of given id
const isAncestor = (node, id: string): boolean =>
  getAncestorsIds(id).some(i => node.id === i);

// node is parent of given id
const isAncestorSibling = (node, id: string): boolean =>
  getAncestorsIds(id).some(i => isChild(node, i));

// node is parent of given id
// const isParent = (node, id: string): boolean =>
//   id.split(idSeparator).slice(-1).join(idSeparator) === node.id;
