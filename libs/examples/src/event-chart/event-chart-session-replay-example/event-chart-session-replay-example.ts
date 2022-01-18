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

import { Component } from '@angular/core';

/* eslint-disable max-lines */
interface EventChartDemoEvent {
  lane: string;
  value: number;
  duration: number;
  color?: 'default' | 'error' | 'filtered';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

@Component({
  selector: 'dt-example-event-chart-session-replay',
  templateUrl: 'event-chart-session-replay-example.html',
})
export class DtExampleEventChartSessionReplay {
  /** Cleaned up data received from session replay. */
  private TEST_DATA = [
    {
      type: 'Xhr',
      actionDuration: 286,
      converted: true,
      started: 1566386627156,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 29,
      converted: false,
      started: 1566386627720,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 16,
      converted: false,
      started: 1566386643136,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 188,
      converted: true,
      started: 1566386643190,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 113,
      converted: false,
      started: 1566386643294,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 26,
      converted: false,
      started: 1566386643702,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 194,
      converted: false,
      started: 1566386659308,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 88,
      converted: true,
      started: 1566386659337,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 28,
      converted: false,
      started: 1566386659787,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 67,
      converted: true,
      started: 1566386675104,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 26,
      converted: false,
      started: 1566386675556,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 60,
      converted: true,
      started: 1566386691235,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 27,
      converted: false,
      started: 1566386691725,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 291,
      converted: true,
      started: 1566386707287,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 224,
      converted: false,
      started: 1566386707292,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 23,
      converted: false,
      started: 1566386707739,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 69,
      converted: true,
      started: 1566386722814,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 162,
      converted: false,
      started: 1566386722859,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 24,
      converted: false,
      started: 1566386723246,
      name: '/easytravel/rest/locations?match=<masked>',
      error: true,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 52,
      converted: true,
      started: 1566386738266,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 22,
      converted: false,
      started: 1566386738741,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 41,
      converted: true,
      started: 1566386753999,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 29,
      converted: false,
      started: 1566386754469,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 309,
      converted: true,
      started: 1566386770530,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 220,
      converted: false,
      started: 1566386770605,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 50,
      converted: false,
      started: 1566386770928,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 87,
      converted: true,
      started: 1566386786078,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 167,
      converted: false,
      started: 1566386786117,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 29,
      converted: false,
      started: 1566386786520,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 49,
      converted: true,
      started: 1566386801551,
      name: '/easytravel/rest/journeys/?match=<masked>&from=&to=',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 179,
      converted: false,
      started: 1566386801582,
      name: 'loading of page /current',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Load',
      actionDuration: 1484,
      converted: false,
      started: 1566386801827,
      name: 'loading of page /forecast',
      error: false,
      application: 'Permanent Docker',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 32,
      converted: true,
      started: 1566386802066,
      name: '/easytravel/rest/locations?match=<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 270,
      converted: true,
      started: 1566386803293,
      name: '/easytravel/rest/journeys/<masked>',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      type: 'Xhr',
      actionDuration: 42,
      converted: true,
      started: 1566386804080,
      name: '/easytravel/rest/login',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: 'Satisfying',
    },
    {
      started: 1566386804122,
      name: 'Arrivaldi Apriando',
      type: 'UserTag',
      error: false,
      application: 'easytravel-ang.dynatrace.com',
      apdexRating: '',
    },
  ];

  /** internal data of converted events to be used in the template. */
  _events: EventChartDemoEvent[];

  constructor() {
    this._events = this.getEvents();
  }

  /**
   * Transformer function that converts sample data into a usable datastructure
   * for the template.
   */
  getEvents(): EventChartDemoEvent[] {
    const events: EventChartDemoEvent[] = [];
    this.TEST_DATA.forEach((event) => {
      if (event.converted) {
        events.push({
          value: event.started,
          duration: Math.floor((event.actionDuration || 0) / 500), // Treat everything below 500 as 0
          lane: 'Conversion',
          data: {
            name: event.name,
            type: event.type,
          },
        });
      } else if (event.error) {
        events.push({
          value: event.started,
          duration: Math.floor((event.actionDuration || 0) / 500), // Treat everything below 500 as 0
          lane: event.type,
          color: 'error',
          data: {
            name: event.name,
            type: event.type,
          },
        });
      } else {
        events.push({
          value: event.started,
          duration: Math.floor((event.actionDuration || 0) / 500), // Treat everything below 500 as 0
          lane: event.type,
          data: {
            name: event.name,
            type: event.type,
          },
        });
      }
    });
    return events;
  }
}
