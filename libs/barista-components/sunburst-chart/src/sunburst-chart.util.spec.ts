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

import { sunburstChartMock } from './sunburst-chart.mock';
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
  const filledNodes = fillNodes(nodes);
  const palette = DT_CHART_COLOR_PALETTE_ORDERED;
  const disabledColor = DtColors.GRAY_300;
  const disabledColorHover = `${disabledColor}99`;

  describe('fillNodes', () => {
    it('should fill and sort the values and children', () => {
      const expected = [
        {
          children: [
            {
              color: palette[1],
              origin: sunburstChartMock[0].children[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[1],
              origin: sunburstChartMock[0].children[0],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[1],
          origin: sunburstChartMock[0],
          depth: 2,
          id: '0',
          label: 'Purple',
          value: 4,
          valueRelative: 0.5,
        },
        {
          children: [
            {
              color: palette[0],
              origin: sunburstChartMock[1].children[1],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              origin: sunburstChartMock[1].children[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          origin: sunburstChartMock[1],
          depth: 2,
          id: '1',
          label: 'Green',
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
              children: [],
              isCurrent: false,
              color: palette[1],
              colorHover: `${palette[1]}99`,
              origin: sunburstChartMock[0].children[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
              showLabel: false,
              visible: false,
            },
            {
              active: false,
              children: [],
              isCurrent: false,
              showLabel: false,
              visible: false,
              color: palette[1],
              colorHover: `${palette[1]}99`,
              origin: sunburstChartMock[0].children[0],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          active: false,
          isCurrent: false,
          showLabel: true,
          visible: true,
          color: palette[1],
          colorHover: `${palette[1]}99`,
          origin: sunburstChartMock[0],
          depth: 2,
          id: '0',
          label: 'Purple',
          value: 4,
          valueRelative: 0.5,
        },
        {
          children: [
            {
              active: false,
              children: [],
              isCurrent: false,
              showLabel: false,
              visible: false,
              color: palette[0],
              colorHover: `${palette[0]}99`,
              origin: sunburstChartMock[1].children[1],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              active: false,
              children: [],
              isCurrent: false,
              showLabel: false,
              visible: false,
              color: palette[0],
              colorHover: `${palette[0]}99`,
              origin: sunburstChartMock[1].children[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          active: false,
          isCurrent: false,
          showLabel: true,
          visible: true,
          color: palette[0],
          colorHover: `${palette[0]}99`,
          origin: sunburstChartMock[1],
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
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
              children: [],
              isCurrent: false,
              color: disabledColor,
              colorHover: disabledColorHover,
              origin: sunburstChartMock[0].children[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
              showLabel: false,
              visible: false,
            },
            {
              active: false,
              children: [],
              isCurrent: false,
              showLabel: false,
              visible: false,
              color: disabledColor,
              colorHover: disabledColorHover,
              origin: sunburstChartMock[0].children[0],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          active: false,
          isCurrent: false,
          showLabel: false,
          visible: true,
          color: disabledColor,
          colorHover: disabledColorHover,
          origin: sunburstChartMock[0],
          depth: 2,
          id: '0',
          label: 'Purple',
          value: 4,
          valueRelative: 0.5,
        },
        {
          children: [
            {
              active: true,
              children: [],
              isCurrent: true,
              showLabel: false,
              visible: true,
              color: palette[0],
              colorHover: palette[0], // no visible hover
              origin: sunburstChartMock[1].children[1],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              active: false,
              children: [],
              isCurrent: false,
              showLabel: false,
              visible: true,
              color: disabledColor,
              colorHover: disabledColorHover,
              origin: sunburstChartMock[1].children[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          active: true,
          isCurrent: false,
          showLabel: false,
          visible: true,
          color: palette[0],
          colorHover: `${palette[0]}99`,
          origin: sunburstChartMock[1],
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
        },
      ];
      const actual = getNodesWithState(filledNodes, '1.0');

      expect(actual).toEqual(expected);
    });
  });

  describe('getSelectedNodes', () => {
    it('should return array of filled nodes', () => {
      const selected = filledNodes[0];
      const expected = [
        {
          children: [
            {
              color: palette[1],
              origin: sunburstChartMock[0].children[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[1],
              origin: sunburstChartMock[0].children[0],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[1],
          origin: sunburstChartMock[0],
          depth: 2,
          id: '0',
          label: 'Purple',
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
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              origin: {
                label: 'Blue',
                value: 1,
              },
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[1],
              depth: 1,
              id: '0.1',
              label: 'Red',
              origin: {
                label: 'Red',
                value: 3,
              },
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[1],
          depth: 2,
          id: '0',
          label: 'Purple',
          origin: {
            children: [
              {
                label: 'Red',
                value: 3,
              },
              {
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
              isCurrent: false,
              origin: expect.any(Object),
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              colorHover: expect.any(String),
              isCurrent: false,
              origin: expect.any(Object),
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          colorHover: expect.any(String),
          isCurrent: false,
          origin: expect.any(Object),
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
        },
        {
          color: palette[0],
          colorHover: expect.any(String),
          isCurrent: false,
          origin: expect.any(Object),
          depth: 1,
          id: '1.0',
          label: 'Blue',
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
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 0,
          value: 4,
        },
        {
          data: expect.anything(),
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          value: 4,
        },
      ];
      const actual = getSlices(getNodesWithState(filledNodes));

      expect(actual).toEqual(expected);
    });
    it('should return slices if selected', () => {
      const expected = [
        {
          data: expect.anything(),
          endAngle: 3.141592653589793,
          index: 0,
          labelPosition: [expect.any(Number), expect.any(Number)],
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 0,
          value: 4,
        },
        {
          data: expect.anything(),
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          value: 4,
        },
        {
          data: {
            active: true,
            children: [],
            color: '#7c38a1',
            colorHover: '#7c38a1',
            isCurrent: true,
            origin: expect.any(Object),
            depth: 1,
            id: '1.0',
            label: 'Blue',
            showLabel: false,
            value: 1,
            valueRelative: 0.125,
            visible: true,
          },
          endAngle: 6.283185307179586,
          index: 1,
          labelPosition: [expect.any(Number), expect.any(Number)],
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 5.497787143782138,
          value: 1,
        },
        {
          data: {
            active: false,
            children: [],
            color: disabledColor,
            colorHover: disabledColorHover,
            isCurrent: false,
            origin: expect.any(Object),
            depth: 1,
            id: '1.1',
            label: 'Yellow',
            showLabel: false,
            value: 3,
            valueRelative: 0.375,
            visible: true,
          },
          endAngle: 5.497787143782138,
          index: 0,
          labelPosition: [expect.any(Number), expect.any(Number)],
          tooltipPosition: [expect.any(Number), expect.any(Number)],
          padAngle: 0,
          path: expect.any(String),
          showLabel: true,
          startAngle: 3.141592653589793,
          value: 3,
        },
      ];
      const actual = getSlices(getNodesWithState(filledNodes, '1.0'));

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
