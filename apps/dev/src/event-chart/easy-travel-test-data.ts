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
  EventChartDemoDataSource,
  EventChartDemoEvent,
  EventChartDemoLane,
  EventChartDemoLegendItem,
  EventChartDemoHeatfield,
} from './event-chart-demo-data';

export const EASY_TRAVEL_TEST_DATA = [
  {
    data: [
      {
        x: 0,
        y: 0,
        source: {
          id: '1565268603832x1565268607398x567_515858017@0@1565268603832@1565268606796@MOBILE_APPLICATION-752C288D59734C79@0',
          currentValues: {
            eActionTime: 2964,
            eHttpReqError: 0,
            timeChartValues: [],
          },
          type: 'MobileAction',
          appType: 'MOBILE_APPLICATION',
          apdexRating: 'TOLERATING',
          hasWaterfall: true,
          jsErrors: 0,
          converted: false,
          started: 1565268603832,
          crash: false,
          name: 'Loading easyTravel',
          error: false,
          application: 'easyTravel Mobile',
          errorCount: 0,
          appId: 'MOBILE_APPLICATION-752C288D59734C79',
          actionDuration: 2964,
          domain: '',
          errorTypes: [],
        },
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 2965,
        y: 0,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 3055,
        y: 1,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 3080,
        y: 0,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 3323,
        y: 2,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#dc172a',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 3428,
        y: 1,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
      {
        x: 3437,
        y: 0,
        source: {},
        marker: {
          enabled: true,
          fillColor: '#c396e0',
          symbol: 'circle',
          _width: 16,
          _height: 16,
        },
      },
    ],
  },
];

export class EasyTravelDataSource implements EventChartDemoDataSource {
  getEvents(): EventChartDemoEvent[] {
    return EASY_TRAVEL_TEST_DATA[0].data.map((obj) => ({
      value: obj.x,
      duration: obj.source.actionDuration || 0,
      lane: obj.y.toString(),
      data: {
        name: (obj.source && obj.source.name) || '',
        type: (obj.source && obj.source.type) || '',
      },
    }));
  }

  getLanes(): EventChartDemoLane[] {
    const lanes: EventChartDemoLane[] = [];
    for (const event of EASY_TRAVEL_TEST_DATA[0].data) {
      const name = event.y.toString();
      if (!lanes.find((l) => l.name === name)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let color: any = 'default';
        if (event.marker.fillColor === '#dc172a') {
          color = 'error';
        }
        lanes.push({ name, label: name, color });
      }
    }
    return lanes;
  }

  getLegendItems(): EventChartDemoLegendItem[] {
    const lanesPerColor = new Map<string, EventChartDemoLegendItem>();
    for (const lane of this.getLanes()) {
      const item = lanesPerColor.get(lane.color);
      if (item && item.lanes.indexOf(lane.name) === -1) {
        item.lanes.push(lane.name);
      } else if (!item) {
        const label =
          lane.color !== 'default' ? lane.label : 'User action or event';
        lanesPerColor.set(lane.color, { label, lanes: [lane.name] });
      }
    }
    return Array.from(lanesPerColor.values());
  }

  getHeatfields(): EventChartDemoHeatfield[] {
    return [
      {
        end: 1250,
        data: {
          page: '/home',
          pageGroup: '/home',
        },
      },
      {
        start: 1250,
        end: 2000,
        data: {
          page: '/booking/asdf',
          pageGroup: '/booking',
        },
        color: 'error',
      },
      {
        start: 2000,
        end: 2000,
        data: {
          page: '/cart/asdf3',
          pageGroup: '/cart',
        },
      },
      {
        start: 2000,
        end: 2000,
        data: {
          page: '/cart/asdf1',
          pageGroup: '/cart',
        },
      },
      {
        start: 2000,
        end: 3000,
        data: {
          page: '/cart/asdf2',
          pageGroup: '/cart',
        },
      },
      {
        start: 3000,
        data: {
          page: '/finish',
          pageGroup: '/finish',
        },
      },
    ];
  }
}
