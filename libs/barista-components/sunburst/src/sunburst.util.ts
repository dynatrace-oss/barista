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
  label: string;
  value?: number;
  color?: DtColors | string;
  children?: DtSunburstNode[];
}

export enum DtSunburstValueMode {
  ABSOLUTE = 'absolute',
  PERCENT = 'percent',
}

export interface DtSunburstNodeInternal extends DtSunburstNode {
  id: string;
  value: number;
  valueRelative?: number;
  children?: DtSunburstNodeInternal[];

  // number of children
  depth: number;
  color: DtColors | string;
  visible: boolean;
  active: boolean;
  showLabel: boolean;
}

export interface DtSunburstSlice
  extends d3.PieArcDatum<DtSunburstNodeInternal> {
  path: string | null;
  labelPosition: [number, number];
  showLabel: boolean;
}

const svgSettings = {
  outerRadius: 160,
  innerRadius: 64,
  labelOffsetRadius: 32,
  minAngleForLabel: (15 / 360) * 2 * Math.PI,
};
const idSeparator = '.';

/*
 *
 *  SLICE CREATION
 *
 */
export const getSlices = (
  series: DtSunburstNodeInternal[],
): DtSunburstSlice[] => {
  const numLevels = series.reduce(
    (maxLevel, node) => Math.max(maxLevel, node.depth),
    0,
  );

  return getSlicesByParent(
    series,
    (svgSettings.outerRadius - svgSettings.innerRadius) / (numLevels * 2),
  );
};

export const getSlicesByParent = (
  nodes: DtSunburstNodeInternal[],
  levelWidth: number,
  initialRadius: number = svgSettings.innerRadius,
  startAngle: number = 0,
  endAngle: number = 2 * Math.PI,
): DtSunburstSlice[] => {
  const slices = d3
    .pie<DtSunburstNodeInternal>()
    .startAngle(startAngle)
    .endAngle(endAngle)
    .value(d => d.value ?? 0)(nodes);

  return slices
    .filter(slice => slice.data.visible)
    .reduce((paths, segment) => {
      const sliceBoundaries = {
        startAngle: segment.startAngle,
        endAngle: segment.endAngle,
        innerRadius: initialRadius,
        outerRadius: levelWidth * (segment.data.active ? 2 : 1) + initialRadius,
      };
      return [
        ...paths,
        {
          ...segment,
          path: d3.arc()(sliceBoundaries),
          labelPosition: d3.arc().centroid({
            ...sliceBoundaries,
            innerRadius:
              sliceBoundaries.outerRadius + svgSettings.labelOffsetRadius,
            outerRadius:
              sliceBoundaries.outerRadius + svgSettings.labelOffsetRadius,
          }),
          showLabel:
            segment.endAngle - segment.startAngle >
            svgSettings.minAngleForLabel,
        },
        ...getSlicesByParent(
          segment.data.children ?? [],
          levelWidth,
          levelWidth * (segment.data.active ? 2 : 1) + initialRadius,
          segment.startAngle,
          segment.endAngle,
        ),
      ];
    }, []);
};

/*
 *
 *  NODE PARSING
 *
 */

/**
 * Fill the nodes with the missing information: id, depth, value (if not provided but has children), color
 * @param nodes provided by the user
 * @param parent parent of current nodes. Used id
 * @param color color of the parent
 */
export const fillSeries = (nodes: DtSunburstNode[]): DtSunburstNodeInternal[] =>
  nodes
    .map(fillUpAndSortNodes)
    .map((child, i, children) =>
      fillDownNodes(child, i, children, getTotalValue(children)),
    )
    .sort((a, b) => a.value - b.value);

/**
 * Fill value and depth of node based on it's children
 * @param node node to fill
 * @returns partial DtSunburstNodeInternal with all children's values and depths
 */
const fillUpAndSortNodes = (node: DtSunburstNode) => {
  const children = node.children
    ?.map(fillUpAndSortNodes)
    .sort((a, b) => a.value - b.value);

  return {
    ...node,
    children,
    value: children ? getValue(children) : node.value ?? 0,
    depth: children
      ? 1 + Math.max(...children?.map(child => child.depth ?? 0))
      : 1,
  };
};

/**
 * Fill children's ids, color and relativeValue based on the parent one
 * @param node node to fill
 * @param i sibling index
 * @param nodes all siblings
 * @param parent node to whom it belongs
 */
const fillDownNodes = (
  node: DtSunburstNodeInternal,
  i: number,
  nodes: DtSunburstNodeInternal[],
  totalValue: number,
  parent?: DtSunburstNodeInternal,
): DtSunburstNodeInternal => {
  const filledNode = {
    ...node,
    id: getId(i, parent?.id),
    color: node.color ?? (parent ? parent.color : getColor(i, nodes.length)),
    valueRelative: node.value / totalValue,
  };

  return {
    ...filledNode,
    children: node.children?.map((child, i, children) =>
      fillDownNodes(child, i, children, totalValue, filledNode),
    ),
  };
};

export const getNodesWithState = (
  nodes: DtSunburstNodeInternal[] = [],
  id?: string,
): DtSunburstNodeInternal[] =>
  nodes.map(node => ({
    ...node,
    children: getNodesWithState(node.children, id),
    color:
      !id || isAncestor(node, id) || isCurrent(node, id) || isChild(node, id)
        ? node.color
        : DtColors.GRAY_300,
    active: isAncestor(node, id) || isCurrent(node, id),
    visible:
      getLevel(node.id) === 1 ||
      isAncestorSibling(node, id) ||
      isChild(node, id),
    showLabel: (!id && getLevel(node.id) === 1) || isChild(node, id),
  }));

/*
 *
 *  SELECTION PARSING
 *
 */
/**
 * @description Get selected path for the sunburst following the original data but with only one child per node
 * @param nodes Whole set of data
 * @param leaf Selected element
 * @returns Path for the sunburst with only one child per node
 */
export const getSelectedNodes = (
  nodes: DtSunburstNodeInternal[],
  leaf: DtSunburstNodeInternal,
): DtSunburstNodeInternal[] =>
  leaf.id.split(idSeparator, -1).reduce(
    (
      tree: {
        currentLevel: DtSunburstNodeInternal[];
        result: DtSunburstNodeInternal[];
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
      currentLevel: nodes,
      result: [],
    },
  ).result;

export const getSelectedNodesFromOutside = (
  nodes: DtSunburstNodeInternal[],
  selectedNodes: DtSunburstNode[],
): DtSunburstNodeInternal[] =>
  selectedNodes.reduce(
    (
      tree: {
        currentLevel: DtSunburstNodeInternal[];
        result: DtSunburstNodeInternal[];
      },
      selected,
    ) => {
      const currentNode = tree.currentLevel.find(
        current => current.label === selected.label,
      );
      // TODO: this is assuming the values are correct. Otherwise we should provide an error
      if (currentNode) {
        tree.result.push(currentNode);

        // update for next iteration
        if (currentNode.children) tree.currentLevel = currentNode.children;
      }
      return tree;
    },
    {
      currentLevel: nodes,
      result: [],
    },
  ).result;

export const getSelectedId = (
  allNodes: DtSunburstNode[],
  selectedNodes: DtSunburstNode[] = [],
): string | undefined =>
  selectedNodes.reduce(
    (tree: { currentLevel: DtSunburstNode[]; id?: string }, selectedNode) => {
      const index = tree.currentLevel.findIndex(
        node => node.label === selectedNode.label,
      );

      tree.id = getId(index, tree.id);
      tree.currentLevel = tree.currentLevel[index]?.children ?? [];
      return tree;
    },
    {
      currentLevel: allNodes,
      id: undefined,
    },
  ).id;

/*
 *
 *  UTILS
 *
 */

const getId = (i: number, parentId?: string) =>
  parentId ? `${parentId}${idSeparator}${i}` : `${i}`;

export const getValue = (nodes: DtSunburstNode[]) =>
  nodes.reduce((total, p) => total + (p?.value ?? 0), 0);

const getTotalValue = (nodes: any[]): number =>
  nodes.reduce((total, { value }) => total + (value ?? 0), 0);

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
const isChild = (node, id?: string): boolean =>
  !!id && node.id.indexOf(id) === 0 && getLevel(node.id) === getLevel(id) + 1;

//  node is ancestor of given id
const isCurrent = (node, id?: string): boolean => !!id && node.id === id;

//  node is ancestor of given id
const isAncestor = (node, id?: string): boolean =>
  !!id && getAncestorsIds(id).some(i => node.id === i);

// node is parent of given id
const isAncestorSibling = (node, id?: string): boolean =>
  !!id && getAncestorsIds(id).some(i => isChild(node, i));

// node is parent of given id
// const isParent = (node, id: string): boolean =>
//   id.length>0 && && id.split(idSeparator).slice(-1).join(idSeparator) === node.id;
