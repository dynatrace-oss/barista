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

import { DtEventChartColors } from '@dynatrace/barista-components/event-chart';

import {
  EventChartDemoDataSource,
  EventChartDemoEvent,
  EventChartDemoLane,
  EventChartDemoLegendItem,
  EventChartDemoHeatfield,
} from './event-chart-demo-data';

/* eslint-disable max-lines */

const TEST_DATA = [
  {
    duration: 46,
    value: 1567749909410,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@0@1567749909410@1567749909433@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 23,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 23,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749909410,
      domain: '',
      crash: false,
      name: 'AppStart (CwsAppStartController)',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 1786,
    value: 1567749909410,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@1@1567749909410@1567749910303@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 893,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 893,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749909410,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0001WithWebRequest',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: null,
    value: 1567749909433,
    lane: 'UserTag',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@2@1567749909433@1567749909433@MOBILE_APPLICATION-752C288D59734C79@0',
      appType: 'MOBILE_APPLICATION',
      jsErrors: 0,
      hasWaterfall: false,
      started: 1567749909433,
      crash: false,
      name: 'userTag@c1t1u202i1567745315857r367',
      type: 'UserTag',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
      apdexRating: '',
    },
  },
  {
    duration: 642,
    value: 1567749927876,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@3@1567749927876@1567749928197@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 321,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 321,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749927876,
      domain: '',
      crash: false,
      name: 'Touch on Search',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 200,
    value: 1567749927876,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@4@1567749927876@1567749927976@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 100,
        eHttpReqError: 1,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 100,
      jsErrors: 1,
      apdexRating: 'Frustrating',
      hasWaterfall: true,
      converted: false,
      started: 1567749927876,
      domain: '',
      crash: false,
      name: 'Touch on Touch on Search (with error)',
      error: true,
      application: 'easyTravel Demo',
      errorCount: 1,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: ['HTTP Error'],
    },
  },
  {
    duration: 1932,
    value: 1567749938792,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@5@1567749938792@1567749939758@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 966,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 966,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749938792,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0007WithWebRequestUnlinkable',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 1138,
    value: 1567749961133,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@6@1567749961133@1567749961702@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 569,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 569,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749961133,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0004',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 642,
    value: 1567749968705,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@7@1567749968705@1567749969026@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 321,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 321,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749968705,
      domain: '',
      crash: false,
      name: 'Touch on Search',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 1120,
    value: 1567749969425,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@8@1567749969425@1567749969985@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 560,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 560,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749969425,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0006',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 200,
    value: 1567749969425,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@9@1567749969425@1567749969525@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 100,
        eHttpReqError: 1,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 100,
      jsErrors: 1,
      apdexRating: 'Frustrating',
      hasWaterfall: true,
      converted: false,
      started: 1567749969425,
      domain: '',
      crash: false,
      name: 'Touch on Touch on Search (with error)',
      error: true,
      application: 'easyTravel Demo',
      errorCount: 1,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: ['HTTP Error'],
    },
  },
  {
    duration: 1860,
    value: 1567749990245,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@10@1567749990245@1567749991175@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 930,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 930,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567749990245,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0001WithWebRequest',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 876,
    value: 1567750018201,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@11@1567750018201@1567750018639@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 438,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 438,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567750018201,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0002',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
  {
    duration: 200,
    value: 1567750018201,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@12@1567750018201@1567750018301@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 100,
        eHttpReqError: 1,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 100,
      jsErrors: 1,
      apdexRating: 'Frustrating',
      hasWaterfall: true,
      converted: false,
      started: 1567750018201,
      domain: '',
      crash: false,
      name: 'Touch on Touch on Search (with error)',
      error: true,
      application: 'easyTravel Demo',
      errorCount: 1,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: ['HTTP Error'],
    },
  },
  {
    duration: 1772,
    value: 1567750026549,
    lane: 'MobileAction',
    source: {
      id: '1567749909410x1567750027435xc1t1u202i1567745315857r367_100@13@1567750026549@1567750027435@MOBILE_APPLICATION-752C288D59734C79@0',
      currentValues: {
        eActionTime: 886,
        eHttpReqError: 0,
        timeChartValues: [],
      },
      type: 'MobileAction',
      appType: 'MOBILE_APPLICATION',
      actionDuration: 886,
      jsErrors: 0,
      apdexRating: 'Satisfying',
      hasWaterfall: true,
      converted: false,
      started: 1567750026549,
      domain: '',
      crash: false,
      name: 'Display CwsViewController0004WithWebRequestUnlinkable',
      error: false,
      application: 'easyTravel Demo',
      errorCount: 0,
      appId: 'MOBILE_APPLICATION-752C288D59734C79',
      w3cResourceTimingsEnabled: true,
      errorTypes: [],
    },
  },
];

export class MobileActionDataSource implements EventChartDemoDataSource {
  getHeatfields(): EventChartDemoHeatfield[] {
    return [];
  }

  getEvents(): EventChartDemoEvent[] {
    const events: EventChartDemoEvent[] = [];
    TEST_DATA.forEach((event) => {
      let color: DtEventChartColors = 'default';
      if (event.source.apdexRating !== 'Satisfying') {
        color = 'error';
      }
      // if (event.source.name.includes('WithWebRequest')) {
      //   state = 'filtered';
      // }
      events.push({
        value: event.source.started,
        duration: 0,
        lane: event.lane,
        color,
        data: {
          name: event.source.name,
          type: event.source.type,
        },
      });
      if (event.source.converted) {
        events.push({
          value: event.source.started,
          duration: 0,
          lane: 'Conversion',
          data: {
            name: event.source.name,
            type: event.source.type,
          },
        });
      }
    });

    return events;
  }

  getLanes(): EventChartDemoLane[] {
    return TEST_DATA.reduce((lanes: EventChartDemoLane[], event, _source) => {
      const name = event.lane;
      const exits = lanes.find((l) => l.name === name);
      if (!exits) {
        lanes.push({
          name,
          label: name,
          color: name === 'Conversion' ? 'conversion' : 'default',
        });
      }
      return lanes;
    }, []);
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
