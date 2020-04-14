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

export interface DtSunburstNodeInternal {
  origin: DtSunburstNode;

  id: string;
  label: string;
  value: number;
  valueRelative: number;
  children?: DtSunburstNodeInternal[];

  depth: number;
  color: DtColors | string;
  colorHover: DtColors | string;
  isCurrent: boolean;
  visible: boolean;
  active: boolean;
  showLabel: boolean;
}

export interface DtSunburstSlice
  extends d3.PieArcDatum<DtSunburstNodeInternal> {
  path: string | null;
  labelPosition: [number, number];
  tooltipPosition: [number, number];
  showLabel: boolean;
}

const SVG_SETTINGS = {
  outerRadius: 160,
  innerRadius: 64,
  labelOffsetRadius: 32,
  tooltipOffsetRadius: 64,
  minAngleForLabel: (15 / 360) * 2 * Math.PI,
};
const IS_SEPARATOR = '.';

/*
 *
 *  NODE PARSING
 *
 */

/**
 * @description Fill the nodes with the missing information: id, depth, value (if not provided but has children), color
 *
 * @param nodes whole set of nodes provided by user
 * @param parent parent of current nodes. Used id
 * @param color color of the parent
 */
export const fillNodes = (nodes: DtSunburstNode[]): DtSunburstNodeInternal[] =>
  nodes
    .map(fillUpAndSortNodes)
    .sort((a, b) => a.value - b.value)
    .map((child, i, children) =>
      fillDownNodes(child, i, children, getValue(children)),
    );

/**
 * @description Fill value and depth of node based on it's children
 *
 * @param node node to fill
 * @returns partial DtSunburstNodeInternal with all children's values and depths
 */
const fillUpAndSortNodes = (node: DtSunburstNode) => {
  const children = node.children
    ?.map(fillUpAndSortNodes)
    .sort((a, b) => a.value - b.value);

  return {
    origin: node,
    label: node.label,
    children,
    value: children ? getValue(children) : node.value ?? 0,
    depth: children
      ? 1 + Math.max(...children?.map(child => child.depth ?? 0))
      : 1,
  };
};

/**
 * @description Fill children's ids, color and relativeValue based on the parent one
 *
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
    color:
      node.origin.color ?? (parent ? parent.color : getColor(i, nodes.length)),
    valueRelative: node.value / totalValue,
  };

  return {
    ...filledNode,
    children: node.children?.map((child, j, children) =>
      fillDownNodes(child, j, children, totalValue, filledNode),
    ),
  };
};

/**
 * @description Get arrays with visibility options based on selected id
 *
 * @param nodes whole set of filled nodes
 * @param id current selection
 */
export const getNodesWithState = (
  nodes: DtSunburstNodeInternal[] = [],
  id?: string,
): DtSunburstNodeInternal[] =>
  nodes.map(node => ({
    ...node,
    children: getNodesWithState(node.children, id),
    ...getColors(
      !id || isAncestor(node, id) || isCurrent(node, id) || isChild(node, id),
      isCurrent(node, id),
      node.color,
      DtColors.GRAY_300,
    ),
    active: isAncestor(node, id) || isCurrent(node, id),
    isCurrent: isCurrent(node, id),
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
 *
 * @param nodes whole set of filled nodes
 * @param leaf Selected element
 */
export const getSelectedNodes = (
  nodes: DtSunburstNodeInternal[],
  leaf: DtSunburstNodeInternal,
): DtSunburstNodeInternal[] =>
  leaf.id.split(IS_SEPARATOR, -1).reduce(
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

/**
 * @description Get an array of filled nodes based on the non-filled selectedNodes
 *
 * @param nodes whole set of filled nodes
 * @param selectedNodes array of selected nodes
 */
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
        current => current.origin === selected,
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

/**
 * @description Get the id of the current selection from an unfilled node
 *
 * @param nodes whole set of filled nodes
 * @param selectedNodes array of selected nodes
 */
export const getSelectedId = (
  nodes: DtSunburstNodeInternal[],
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
      currentLevel: nodes,
      id: undefined,
    },
  ).id;

/*
 *
 *  SLICE CREATION
 *
 */

/**
 * @description Get slices to be painted in SVG filtered by visibility and with actual color
 *
 * @param nodes whole set of filled nodes
 */
export const getSlices = (
  nodes: DtSunburstNodeInternal[],
): DtSunburstSlice[] => {
  const numLevels = nodes.reduce(
    (maxLevel, node) => Math.max(maxLevel, node.depth),
    0,
  );

  return getSlicesByParent(
    nodes,
    (SVG_SETTINGS.outerRadius - SVG_SETTINGS.innerRadius) / (numLevels * 2),
  );
};

/**
 * @description Get flattened array slices for current branch
 *
 * @param nodes whole set of filled nodes
 * @param radiusWidth width of given node
 * @param innerRadius radius of current slice. same as outer radius of parent
 * @param startAngle start angle of parent
 * @param endAngle end angle of parent
 */
const getSlicesByParent = (
  nodes: DtSunburstNodeInternal[],
  radiusWidth: number,
  innerRadius: number = SVG_SETTINGS.innerRadius,
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
        innerRadius: innerRadius,
        outerRadius: radiusWidth * (segment.data.active ? 2 : 1) + innerRadius,
      };
      return [
        ...paths,
        {
          ...segment,
          path: d3.arc()(sliceBoundaries),
          labelPosition: d3.arc().centroid({
            ...sliceBoundaries,
            innerRadius:
              sliceBoundaries.outerRadius + SVG_SETTINGS.labelOffsetRadius,
            outerRadius:
              sliceBoundaries.outerRadius + SVG_SETTINGS.labelOffsetRadius,
          }),
          tooltipPosition: d3.arc().centroid({
            ...sliceBoundaries,
            innerRadius:
              sliceBoundaries.outerRadius + SVG_SETTINGS.tooltipOffsetRadius,
            outerRadius:
              sliceBoundaries.outerRadius + SVG_SETTINGS.tooltipOffsetRadius,
          }),
          showLabel:
            segment.endAngle - segment.startAngle >
            SVG_SETTINGS.minAngleForLabel,
        },
        ...getSlicesByParent(
          segment.data.children ?? [],
          radiusWidth,
          radiusWidth * (segment.data.active ? 2 : 1) + innerRadius,
          segment.startAngle,
          segment.endAngle,
        ),
      ];
    }, []);
};

/*
 *
 *  UTILS
 *
 */

/**
 * @description Get id of current node based on parent id and sibling index
 *
 * @param index sibling index
 * @param parentId id of the parent
 */
const getId = (index: number, parentId?: string) =>
  parentId ? `${parentId}${IS_SEPARATOR}${index}` : `${index}`;

/**
 * @description Get sum of children values
 *
 * @param nodes  whole set of filled nodes
 */
export const getValue = (nodes: DtSunburstNode[]) =>
  nodes.reduce((total, p) => total + (p?.value ?? 0), 0);

/**
 * @description Get the level based on current id
 *
 * @param id
 */
const getLevel = (id: string): number => id.split(IS_SEPARATOR).length;

/**
 * @description Get color of the palette. As sunburst is built backwards colors must be inverted
 *
 * @param index sibling index
 * @param totalNodes number of children for parent node
 */
const getColor = (index: number, totalNodes: number): string =>
  DT_CHART_COLOR_PALETTE_ORDERED[
    (totalNodes - index - 1) % DT_CHART_COLOR_PALETTE_ORDERED.length
  ];

/**
 * @description Get color ad colorHover of the palette
 *
 * @param isColoured if it should be coloured
 * @param isCurrentSelected if it's selected leaf
 * @param colorYes color for active
 * @param colorNo color for faded
 */
const getColors = (
  isColoured: boolean,
  isCurrentSelected: boolean,
  colorYes: DtColors | string,
  colorNo: DtColors | string,
) => ({
  color: isColoured ? colorYes : colorNo,
  colorHover: `${isColoured ? colorYes : colorNo}${
    isCurrentSelected ? '' : 99
  }`,
});

/**
 * @description Get an array of all ancestors ids
 *
 * @param id id of leaf node
 */
const getAncestorsIds = (id: string): string[] =>
  id
    .split(IS_SEPARATOR)
    .slice(0, -1)
    .map((_, i, segments) => segments.slice(0, i + 1).join(IS_SEPARATOR));

/**
 * @description Get if node is child of given id
 *
 * @param node node to determine if is child
 * @param id
 */
const isChild = (node, id?: string): boolean =>
  !!id && node.id.indexOf(id) === 0 && getLevel(node.id) === getLevel(id) + 1;

/**
 * @description Get if node matches given id
 *
 * @param node
 * @param id
 */
const isCurrent = (node, id?: string): boolean => !!id && node.id === id;

/**
 * @description Get if node is ancestor of given id
 *
 * @param node node to determine if is ancestor
 * @param id
 */
const isAncestor = (node, id?: string): boolean =>
  !!id && getAncestorsIds(id).some(i => node.id === i);

/**
 * @description Get if node is sibling of ancestor of given id
 *
 * @param node node to determine if is ancestor sibling
 * @param id
 */
const isAncestorSibling = (node, id?: string): boolean =>
  !!id && getAncestorsIds(id).some(i => isChild(node, i));
