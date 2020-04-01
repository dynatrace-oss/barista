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

import { sunburstMock } from './sunburst.mock';
import {
  fillNodes,
  getNodesWithState,
  getSelectedId,
  getSelectedNodesFromOutside,
  getSlices,
  getValue,
  getSelectedNodes,
} from './sunburst.util';
import {
  DT_CHART_COLOR_PALETTE_ORDERED,
  DtColors,
} from '@dynatrace/barista-components/theming';

describe('Sunburst util', () => {
  const nodes = sunburstMock;
  const filledNodes = fillNodes(nodes);
  const palette = DT_CHART_COLOR_PALETTE_ORDERED;
  const disabledColor = DtColors.GRAY_300;

  describe('fillNodes', () => {
    it('should fill and sort the values and children', () => {
      const expected = [
        {
          children: [
            {
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[1],
              depth: 1,
              id: '0.1',
              label: 'Red',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[1],
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
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
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
              color: palette[1],
              depth: 1,
              id: '0.0',
              label: 'Blue',
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              children: [],
              color: palette[1],
              depth: 1,
              id: '0.1',
              label: 'Red',
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          color: palette[1],
          depth: 2,
          id: '0',
          label: 'Purple',
          showLabel: true,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
        {
          children: [
            {
              active: false,
              children: [],
              color: palette[0],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              children: [],
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
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
              children: [],
              color: disabledColor,
              depth: 1,
              id: '0.0',
              label: 'Blue',
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: false,
            },
            {
              active: false,
              children: [],
              color: disabledColor,
              depth: 1,
              id: '0.1',
              label: 'Red',
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: false,
            },
          ],
          active: false,
          color: disabledColor,
          depth: 2,
          id: '0',
          label: 'Purple',
          showLabel: false,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
        {
          children: [
            {
              active: true,
              children: [],
              color: palette[0],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              showLabel: false,
              value: 1,
              valueRelative: 0.125,
              visible: true,
            },
            {
              active: false,
              children: [],
              color: disabledColor,
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              showLabel: false,
              value: 3,
              valueRelative: 0.375,
              visible: true,
            },
          ],
          active: true,
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
          showLabel: false,
          value: 4,
          valueRelative: 0.5,
          visible: true,
        },
      ];
      const actual = getNodesWithState(filledNodes, '1.0');

      expect(actual).toEqual(expected);
    });
  });

  describe('getSelectedNodes', () => {
    it('should return array of filled nodes', () => {
      const selected = {
        active: false,
        children: [],
        color: palette[0],
        depth: 1,
        id: '1.0',
        label: 'Blue',
        showLabel: false,
        value: 1,
        valueRelative: 0.125,
        visible: false,
      };
      const expected = [
        {
          children: [
            {
              color: palette[0],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
        },
        {
          color: palette[0],
          depth: 1,
          id: '1.0',
          label: 'Blue',
          value: 1,
          valueRelative: 0.125,
        },
      ];
      const actual = getSelectedNodes(filledNodes, selected);

      expect(actual).toEqual(expected);
    });
  });

  describe('getSelectedNodesFromOutside', () => {
    it('should return an array of filled nodes matching the selection', () => {
      const selected = [
        {
          children: [
            { label: 'Blue', value: 1 },
            { label: 'Yellow', value: 3 },
          ],
          label: 'Green',
        },
        {
          label: 'Blue',
          value: 1,
        },
      ];
      const expected = [
        {
          children: [
            {
              color: palette[0],
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
        },
        {
          color: palette[0],
          depth: 1,
          id: '1.0',
          label: 'Blue',
          value: 1,
          valueRelative: 0.125,
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
              depth: 1,
              id: '1.0',
              label: 'Blue',
              value: 1,
              valueRelative: 0.125,
            },
            {
              color: palette[0],
              depth: 1,
              id: '1.1',
              label: 'Yellow',
              value: 3,
              valueRelative: 0.375,
            },
          ],
          color: palette[0],
          depth: 2,
          id: '1',
          label: 'Green',
          value: 4,
          valueRelative: 0.5,
        },
        {
          color: palette[0],
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
          labelPosition: [120, 0],
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
          labelPosition: [-120, 1.469576158976824e-14],
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
          labelPosition: [120, 0],
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
          labelPosition: [-144, 1.7634913907721887e-14],
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
          labelPosition: [-73.47521901409735, -177.384870242167],
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
          labelPosition: [-155.21176146189615, 64.29081663733517],
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
