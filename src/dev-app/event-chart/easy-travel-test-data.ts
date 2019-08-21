import {
  EventChartDemoDataSource,
  EventChartDemoEvent,
  EventChartDemoLane,
  EventChartDemoLegendItem,
} from './event-chart-demo-data';

export const EASY_TRAVEL_TEST_DATA = [
  {
    data: [
      {
        x: 0,
        y: 0,
        source: {
          id:
            '1565268603832x1565268607398x567_515858017@0@1565268603832@1565268606796@MOBILE_APPLICATION-752C288D59734C79@0',
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
    return EASY_TRAVEL_TEST_DATA[0].data.map(obj => ({
      value: obj.x,
      duration: obj.source.actionDuration || 0,
      lane: obj.y.toString(),
    }));
  }

  getLanes(): EventChartDemoLane[] {
    const lanes: EventChartDemoLane[] = [];
    for (const event of EASY_TRAVEL_TEST_DATA[0].data) {
      const name = event.y.toString();
      if (!lanes.find(l => l.name === name)) {
        // tslint:disable-next-line: no-any
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
}
