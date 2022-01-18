/**
 * @license
 * Copyright 2022 Dynatrace LLC
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
  sunburstChartMock,
  sunburstChartExtendedMock,
} from './sunburst-chart.mock';
import {
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodesFromOutside,
  getSlices,
  getValue,
  getSelectedNodes,
} from './sunburst-chart.util';
import {
  DT_CHART_COLOR_PALETTE_ORDERED,
  DtColors,
} from '@dynatrace/barista-components/theming';

describe('SunburstChart util', () => {
  const nodes = sunburstChartMock;
  const radius = 500;
  const filledNodes = fillNodes(nodes);
  const palette = DT_CHART_COLOR_PALETTE_ORDERED;
  const disabledColor = DtColors.GRAY_300;
  const disabledColorHover = `${disabledColor}99`;
  const containerWidth = 800;

  describe('fillNodes', () => {
    it('should fill and sort the values and children', () => {
      const expected = [
        {
          children: [
            {
              ariaLabel: 'Blue in Purple is 1',
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              origin: sunburstChartMock[0].children[1],
              value: 1,
              valueRelative: 0.125,
            },
            {
              ariaLabel: 'Red in Purple is 3',
              color: palette[1],
              origin: sunburstChartMock[0].children[0],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          ariaLabel: 'Purple is 4',
          color: palette[1],
          depth: 2,
          id: '0',
          label: 'Purple',
          origin: sunburstChartMock[0],
          value: 4,
          valueRelative: 0.5,
        },
        {
          children: [
            {
              ariaLabel: 'Blue in Green is 1',
              color: palette[0],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              origin: sunburstChartMock[1].children[1],
              value: 1,
              valueRelative: 0.125,
            },
            {
              ariaLabel: 'Yellow in Green is 3',
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              origin: sunburstChartMock[1].children[0],
              value: 3,
              valueRelative: 0.375,
            },
          ],
          ariaLabel: 'Green is 4',
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
          origin: sunburstChartMock[1],
          value: 4,
          valueRelative: 0.5,
        },
      ];
      const actual = fillNodes(nodes);

      expect(actual).toEqual(expected);
    });
  });

  describe('getNodesWithState', () => {
    it('should return the nodes with filled state', () => {
      const expected = [
        {
          children: [
            {
              active: false,
              ariaLabel: 'Blue in Purple is 1',
              children: [],
              color: palette[1],
              colorHover: `${palette[1]}99`,
              depth: 1,
              id: '0.0',
              isCurrent: false,
              label: 'Blue',
              origin: sunburstChartMock[0].children[1],
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              ariaLabel: 'Red in Purple is 3',
              children: [],
              color: palette[1],
              colorHover: `${palette[1]}99`,
              depth: 1,
              id: '0.1',
              isCurrent: false,
              label: 'Red',
              origin: sunburstChartMock[0].children[0],
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          ariaLabel: 'Purple is 4',
          color: palette[1],
          colorHover: `${palette[1]}99`,
          depth: 2,
          id: '0',
          isCurrent: false,
          label: 'Purple',
          origin: sunburstChartMock[0],
          showLabel: true,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
        {
          children: [
            {
              active: false,
              ariaLabel: 'Blue in Green is 1',
              children: [],
              color: palette[0],
              colorHover: `${palette[0]}99`,
              depth: 1,
              id: '1.0',
              isCurrent: false,
              label: 'Blue',
              origin: sunburstChartMock[1].children[1],
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              ariaLabel: 'Yellow in Green is 3',
              children: [],
              color: palette[0],
              colorHover: `${palette[0]}99`,
              depth: 1,
              id: '1.1',
              isCurrent: false,
              label: 'Yellow',
              origin: sunburstChartMock[1].children[0],
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          ariaLabel: 'Green is 4',
          color: palette[0],
          colorHover: `${palette[0]}99`,
          depth: 2,
          id: '1',
          isCurrent: false,
          label: 'Green',
          origin: sunburstChartMock[1],
          showLabel: true,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
      ];
      const actual = getNodesWithState(filledNodes);

      expect(actual).toEqual(expected);
    });

    it('should return the nodes with filled state WHEN one is selected', () => {
      const expected = [
        {
          children: [
            {
              active: false,
              ariaLabel: 'Blue in Purple is 1',
              children: [],
              color: disabledColor,
              colorHover: disabledColorHover,
              depth: 1,
              id: '0.0',
              isCurrent: false,
              label: 'Blue',
              origin: sunburstChartMock[0].children[1],
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              ariaLabel: 'Red in Purple is 3',
              children: [],
              color: disabledColor,
              colorHover: disabledColorHover,
              depth: 1,
              id: '0.1',
              isCurrent: false,
              label: 'Red',
              origin: sunburstChartMock[0].children[0],
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          ariaLabel: 'Purple is 4',
          color: disabledColor,
          colorHover: disabledColorHover,
          depth: 2,
          id: '0',
          isCurrent: false,
          label: 'Purple',
          origin: sunburstChartMock[0],
          showLabel: false,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
        {
          children: [
            {
              active: true,
              ariaLabel: 'Blue in Green is 1',
              children: [],
              color: palette[0],
              colorHover: palette[0], // no visible hover
              depth: 1,
              id: '1.0',
              isCurrent: true,
              label: 'Blue',
              origin: sunburstChartMock[1].children[1],
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: true,
            },
            {
              active: false,
              ariaLabel: 'Yellow in Green is 3',
              children: [],
              color: disabledColor,
              colorHover: disabledColorHover,
              depth: 1,
              id: '1.1',
              isCurrent: false,
              label: 'Yellow',
              origin: sunburstChartMock[1].children[0],
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: true,
            },
          ],
          active: true,
          ariaLabel: 'Green is 4',
          color: palette[0],
          colorHover: `${palette[0]}99`,
          depth: 2,
          id: '1',
          isCurrent: false,
          label: 'Green',
          origin: sunburstChartMock[1],
          showLabel: false,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
      ];
      const actual = getNodesWithState(filledNodes, '1.0');

      expect(actual).toEqual(expected);
    });

    it('should set visible the proper node based on the selected id', () => {
      const SELECTED_PARTENT_NODE = '2';
      const SELECTED_CHILD_NODE = '1';
      const SIBLING_NODE = '12';

      const actualResults = getNodesWithState(
        fillNodes(sunburstChartExtendedMock),
        `${SELECTED_PARTENT_NODE}.${SELECTED_CHILD_NODE}`,
      );
      const selectedGrandParent = actualResults.find(
        (i) => i.id === SELECTED_PARTENT_NODE,
      );

      const selectedParent = selectedGrandParent?.children?.find(
        (i) => i.id === `${SELECTED_PARTENT_NODE}.${SELECTED_CHILD_NODE}`,
      );
      const selectedChild = selectedParent?.children?.find(
        (i) => i.id === `${SELECTED_PARTENT_NODE}.${SELECTED_CHILD_NODE}.0`,
      );

      const selectedSiblingParent = selectedGrandParent?.children?.find(
        (i) => i.id === `${SELECTED_PARTENT_NODE}.${SIBLING_NODE}`,
      );
      const sibling = selectedSiblingParent?.children?.find(
        (i) => i.id === `${SELECTED_PARTENT_NODE}.${SIBLING_NODE}.0`,
      );

      expect(selectedChild?.visible).toBeTruthy();

      expect(sibling?.visible).toBeFalsy();
    });
  });

  describe('getSelectedNodes', () => {
    it('should return array of filled nodes', () => {
      const selected = filledNodes[0];
      const expected = [
        {
          children: [
            {
              ariaLabel: 'Blue in Purple is 1',
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              origin: sunburstChartMock[0].children[1],
              value: 1,
              valueRelative: 0.125,
            },
            {
              ariaLabel: 'Red in Purple is 3',
              color: palette[1],
              depth: 1,
              id: '0.1',
              label: 'Red',
              origin: sunburstChartMock[0].children[0],
              value: 3,
              valueRelative: 0.375,
            },
          ],
          ariaLabel: 'Purple is 4',
          color: palette[1],
          depth: 2,
          id: '0',
          label: 'Purple',
          origin: sunburstChartMock[0],
          value: 4,
          valueRelative: 0.5,
        },
      ];
      const actual = getSelectedNodes(filledNodes, selected);

      expect(actual).toEqual(expected);
    });
  });

  describe('getSelectedNodesFromOutside', () => {
    it('should return an array of filled nodes matching the selection', () => {
      const selected = [sunburstChartMock[0]];
      const expected = [
        {
          children: [
            {
              ariaLabel: 'Blue in Purple is 1',
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              origin: {
                description: 'Blue item',
                label: 'Blue',
                value: 1,
              },
              value: 1,
              valueRelative: 0.125,
            },
            {
              ariaLabel: 'Red in Purple is 3',
              color: palette[1],
              depth: 1,
              id: '0.1',
              label: 'Red',
              origin: {
                description: 'Red item',
                label: 'Red',
                value: 3,
              },
              value: 3,
              valueRelative: 0.375,
            },
          ],
          ariaLabel: 'Purple is 4',
          color: palette[1],
          depth: 2,
          id: '0',
          label: 'Purple',
          origin: {
            children: [
              {
                description: 'Red item',
                label: 'Red',
                value: 3,
              },
              {
                description: 'Blue item',
                label: 'Blue',
                value: 1,
              },
            ],
            label: 'Purple',
          },
          value: 4,
          valueRelative: 0.5,
        },
      ];
      const actual = getSelectedNodesFromOutside(filledNodes, selected);

      expect(actual).toEqual(expected);
    });
  });

  describe('getSelectedId', () => {
    it('should return the id for the selected item', () => {
      const selected = [
        {
          children: [
            {
              color: palette[0],
              colorHover: expect.any(String),
              depth: 1,
              id: '1.0',
              isCurrent: false,
              label: 'Blue',
              origin: expect.any(Object),
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              colorHover: expect.any(String),
              depth: 1,
              id: '1.1',
              isCurrent: false,
              label: 'Yellow',
              origin: expect.any(Object),
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          colorHover: expect.any(String),
          depth: 2,
          id: '1',
          isCurrent: false,
          label: 'Green',
          origin: expect.any(Object),
          value: 4,
          valueRelative: 0.5,
        },
        {
          color: palette[0],
          colorHover: expect.any(String),
          depth: 1,
          id: '1.0',
          isCurrent: false,
          label: 'Blue',
          origin: expect.any(Object),
          value: 1,
          valueRelative: 0.125,
        },
      ];
      const expected = '1.0';
      const actual = getSelectedId(filledNodes, selected);

      expect(actual).toEqual(expected);
    });
  });

  describe('getSlices', () => {
    it('should return initial slices if nothing selected', () => {
      const expected = [
        {
          data: expect.anything(),
          endAngle: 3.141592653589793,
          index: 0,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 0,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 4,
        },
        {
          data: expect.anything(),
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 4,
        },
      ];
      const actual = getSlices(
        getNodesWithState(filledNodes),
        radius,
        containerWidth,
      );

      expect(actual).toEqual(expected);
    });
    it('should return slices if selected', () => {
      const expected = [
        {
          data: {
            active: false,
            ariaLabel: 'Purple is 4',
            children: expect.any(Array),
            color: disabledColor,
            colorHover: disabledColorHover,
            depth: 2,
            id: '0',
            isCurrent: false,
            label: 'Purple',
            origin: expect.any(Object),
            showLabel: false,
            value: 4,
            valueRelative: 0.5,
            visible: true,
          },
          endAngle: 3.141592653589793,
          index: 0,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 0,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 4,
        },
        {
          data: {
            active: true,
            ariaLabel: 'Green is 4',
            children: expect.any(Array),
            color: palette[0],
            colorHover: `${palette[0]}99`,
            depth: 2,
            id: '1',
            isCurrent: false,
            label: 'Green',
            origin: expect.any(Object),
            showLabel: false,
            value: 4,
            valueRelative: 0.5,
            visible: true,
          },
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 4,
        },
        {
          data: {
            active: true,
            ariaLabel: 'Blue in Green is 1',
            children: [],
            color: '#7c38a1',
            colorHover: '#7c38a1',
            depth: 1,
            id: '1.0',
            isCurrent: true,
            label: 'Blue',
            origin: expect.any(Object),
            showLabel: false,
            value: 1,
            valueRelative: 0.125,
            visible: true,
          },
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 5.497787143782138,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 1,
        },
        {
          data: {
            active: false,
            ariaLabel: 'Yellow in Green is 3',
            children: [],
            color: disabledColor,
            colorHover: disabledColorHover,
            depth: 1,
            id: '1.1',
            isCurrent: false,
            label: 'Yellow',
            origin: expect.any(Object),
            showLabel: false,
            value: 3,
            valueRelative: 0.375,
            visible: true,
          },
          endAngle: 5.497787143782138,
          index: 0,
          labelPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          value: 3,
        },
      ];
      const actual = getSlices(
        getNodesWithState(filledNodes, '1.0'),
        radius,
        containerWidth,
      );

      expect(actual).toEqual(expected);
    });
  });

  describe('getValue', () => {
    it("should return sum of values for node's children", () => {
      const expected = 8;
      const actual = getValue(filledNodes);

      expect(actual).toEqual(expected);
    });
  });
});
