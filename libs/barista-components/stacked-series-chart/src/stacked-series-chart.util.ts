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
  DtTheme,
  getDtChartColorPalette,
} from '@dynatrace/barista-components/theming';

/**
 * Definition a series with all its nodes
 */
export interface DtStackedSeriesChartSeries {
  /** Label of the series */
  label: string;
  /** Nodes for this series */
  nodes: DtStackedSeriesChartNode[];
}

/**
 * @internal Definition of series containing extended information for every mode
 */
export interface DtStackedSeriesChartFilledSeries {
  /** Original series */
  origin: DtStackedSeriesChartSeries;
  /** Filled nodes for this series */
  nodes: DtStackedSeriesChartTooltipData[];
}

/**
 * Definition of a legend item
 */
export interface DtStackedSeriesChartLegend {
  /** Label of the node */
  label: string;
  /** Color assigned */
  color: DtColors | string;
  /** Whether it should be visible */
  visible: boolean;
}

/**
 * DtStackedSeriesChartNode represents a single node within the sunburst datastructure.
 */
export interface DtStackedSeriesChartNode {
  /** Label of the node to be shown */
  label: string;
  /** Optional if it has children. Numeric value used to calculate the slices. If it has children you can skip it and it will be calculated based on them */
  value: number;
  /** Color to be used */
  color?: DtColors | string;
}

/** Extended information of DtStackedSeriesChartNode containing useful information that can be used inside the overlay's template */
export interface DtStackedSeriesChartTooltipData {
  /** Node passed by user in `series` array */
  origin: DtStackedSeriesChartNode;
  /** Original parent series */
  seriesOrigin: DtStackedSeriesChartSeries;

  /** Numeric percentage value based on this node vs sum of top level */
  valueRelative: number;
  /** Color for this node in this state */
  color: DtColors | string;
  /** If node is visible */
  visible: boolean;
  /** If node is currently selected */
  selected: boolean;
  /** Current length in percentage given only the visible nodes */
  length?: string;
  /** Text for a11y */
  ariaLabel?: string;
}

/** For single track only, format of value to be displayed in legend */
export type DtStackedSeriesChartValueDisplayMode =
  | 'none'
  | 'absolute'
  | 'percent';

/** Whether track should be filled fully or should take into account the rest of tracks for max value */
export type DtStackedSeriesChartFillMode = 'full' | 'relative';

/** Orientation of the chart */
export type DtStackedSeriesChartMode = 'bar' | 'column';

/*
 *
 *  NODE PARSING
 *
 */

/**
 * @description Fill the series with extended information and preserv original items
 *
 * @param series whole set of series provided by user
 * @param legends used to calculate visibility and color
 *
 * @returns Filled series
 */
export const fillSeries = (
  series: DtStackedSeriesChartSeries[],
  legends: DtStackedSeriesChartLegend[],
): DtStackedSeriesChartFilledSeries[] =>
  series.map((s) => ({
    origin: s,
    nodes: s.nodes.map((node) => ({
      origin: node,
      seriesOrigin: s,
      color: legends.find((legend) => legend.label === node.label)?.color ?? '',
      valueRelative: node.value / getValue(s.nodes),
      visible: true,
      selected: false,
      ariaLabel: `${node.label} in ${s.label} is ${
        node.value
      } out of ${getValue(s.nodes)}`,
    })),
  }));

/**
 * @description Get series with visibility options based on selected id
 *
 * @param series whole set of filled series
 * @param selectedSeries currently selected series if present
 * @param selectedNode currently selected node if present
 * @param max maximum amount to be used for scaling the slices
 *
 * @returns Set of series with visibility, selection and length
 */
export const getSeriesWithState = (
  series: DtStackedSeriesChartFilledSeries[] = [],
  [selectedSeries, selectedNode]:
    | [DtStackedSeriesChartSeries, DtStackedSeriesChartNode]
    | [],
  max?: number,
): DtStackedSeriesChartFilledSeries[] =>
  series.map((s) => ({
    ...s,
    nodes: s.nodes.map((node) => ({
      ...node,
      // in order to use transitions in the track we cannot hide the element but make it 0
      length: node.visible
        ? `${
            (100 * node.origin.value) /
            (max !== undefined
              ? max
              : getValueForFilled(s.nodes.filter((n) => n.visible)))
          }%`
        : '0',
      selected: s.origin === selectedSeries && node.origin === selectedNode,
    })),
  }));

/**
 * @description Set visibility of the node based on legends
 *
 * @param series whole set of filled series
 * @param legends legends used to calculate visibility
 */
export const updateNodesVisibility = (
  series: DtStackedSeriesChartFilledSeries[],
  legends: DtStackedSeriesChartLegend[],
): DtStackedSeriesChartFilledSeries[] => {
  series.forEach((s) => {
    s.nodes.forEach((node) => {
      const found = legends.find((l) => l.label === node.origin.label);

      node.color = found?.color || node.color;
      node.visible = !!found?.visible;
    });
  });

  return series;
};

/**
 * @description Get unified legends with one color for each label. Colors are theme based if not preset in the node
 *
 * @param series Whole set of filled series
 * @param theme Theme used in the page or component
 *
 * @returns Set of legends with one color for each label
 */
export const getLegends = (
  series: DtStackedSeriesChartSeries[],
  theme?: DtTheme,
): DtStackedSeriesChartLegend[] => {
  const legends = series
    // flatten
    .reduce((nodes, s) => [...nodes, ...s.nodes], [])
    // take default colors
    .reduce(
      (labels, node) => ({
        ...labels,
        [node.label]:
          labels[node.label] !== undefined ? labels[node.label] : node.color,
      }),
      {},
    );

  const colors = getDtChartColorPalette(Object.keys(legends).length, theme);

  return Object.keys(legends).map((key, i) => ({
    label: key,
    color: legends[key] ? legends[key] : colors[i],
    visible: true,
  }));
};

/*
 *
 *  UTILS
 *
 */

/**
 * @description Get sum of values
 *
 * @param nodes whole set of nodes
 *
 * @returns sum of nodes values
 */
const getValue = (nodes: DtStackedSeriesChartNode[]): number =>
  nodes.reduce((total, p) => total + (p?.value ?? 0), 0);

/**
 * @description Get sum of values for filled nodes
 *
 * @param nodes whole set of filled nodes
 *
 * @returns sum of nodes values
 */
const getValueForFilled = (nodes: DtStackedSeriesChartTooltipData[]): number =>
  nodes.reduce((total, p) => total + (p?.origin.value ?? 0), 0);

/**
 * @description Get max of all bars sum of values
 *
 * @param series whole set of filled series
 *
 * @returns sum of series values
 */
export const getTotalMaxValue = (
  series: DtStackedSeriesChartSeries[],
): number => Math.max(...series.map((s) => getValue(s.nodes)));
