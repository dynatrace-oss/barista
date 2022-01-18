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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtTimelineChartModule } from './timeline-chart-module';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtTimelineChart', () => {
  let fixture: ComponentFixture<SimpleTestApp>;
  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [DtTimelineChartModule],
        declarations: [SimpleTestApp],
      });

      TestBed.compileComponents();
      fixture = createComponent(SimpleTestApp);
      fixture.detectChanges();
    }),
  );

  describe('marker', () => {
    it('should render timing markers', () => {
      const timelineChart: HTMLElement = fixture.debugElement.query(
        By.css('dt-timeline-chart'),
      ).nativeElement;
      const markers = timelineChart.querySelectorAll(
        '.dt-timeline-chart-timing-marker',
      );

      expect(markers).toHaveLength(2);
    });

    it('should render new timing marker when a new one is added', () => {
      fixture.componentInstance.showThirdTimingMarker = true;
      fixture.detectChanges();

      const timelineChart: HTMLElement = fixture.debugElement.query(
        By.css('dt-timeline-chart'),
      ).nativeElement;
      const markers = timelineChart.querySelectorAll(
        '.dt-timeline-chart-timing-marker',
      );

      expect(markers).toHaveLength(3);
    });

    it('should render key timing markers', () => {
      const timelineChart: HTMLElement = fixture.debugElement.query(
        By.css('dt-timeline-chart'),
      ).nativeElement;
      const markers = timelineChart.querySelectorAll(
        '.dt-timeline-chart-key-timing-marker',
      );

      expect(markers).toHaveLength(1);
    });
  });

  describe('legend', () => {
    it('should render a legend item for each timing marker', () => {
      const timelineChart: HTMLElement = fixture.debugElement.query(
        By.css('dt-timeline-chart'),
      ).nativeElement;
      const legendItems = timelineChart.querySelectorAll('dt-legend-item');

      expect(legendItems).toHaveLength(2);
    });

    it('should update the legend items when new timing markers are added', () => {
      fixture.componentInstance.showThirdTimingMarker = true;
      fixture.detectChanges();

      const timelineChart: HTMLElement = fixture.debugElement.query(
        By.css('dt-timeline-chart'),
      ).nativeElement;
      const legendItems = timelineChart.querySelectorAll('dt-legend-item');

      expect(legendItems).toHaveLength(3);
    });
  });
});

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-timeline-chart value="0.37" unit="s">
      <dt-timeline-chart-timing-marker value="0.02" identifier="R">
        Request start 0.02s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-timing-marker value="0.04" identifier="S">
        Speed index 0.04s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-timing-marker
        value="0.17"
        identifier="I"
        *ngIf="showThirdTimingMarker"
      >
        DOM interactive 0.17s
      </dt-timeline-chart-timing-marker>
      <dt-timeline-chart-key-timing-marker value="0.03" identifier="V">
        Visually complete
      </dt-timeline-chart-key-timing-marker>
    </dt-timeline-chart>
  `,
})
class SimpleTestApp {
  showThirdTimingMarker = false;
}
