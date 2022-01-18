/**
 * @license
 * Copyright 2021 Dynatrace LLC
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

import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtEventChartModule } from './event-chart-module';

import { dispatchFakeEvent } from '@dynatrace/testing/browser';
import { DtEventChart } from './event-chart';
import { DtEventChartSelectedEvent } from './event-chart-directives';
import {
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';

/** Gets the rendered merged numbering. */
function getRenderedMergedTextLabels(fixture: ComponentFixture<any>): string[] {
  const texts = fixture.debugElement.queryAll(
    By.css('.dt-event-chart-style-mergednumber'),
  );
  return texts.map((text) => text.nativeElement.innerHTML.trim());
}

/** Gets the rendered path that connects the rendered Event bubbles. */
function getRenderedEventsPath(fixture: ComponentFixture<any>): string {
  const pathElement = fixture.debugElement.query(
    By.css('.dt-event-chart-path'),
  );
  return pathElement.nativeElement.getAttribute('d');
}

/** Get legend items from the fixture. */
function getLegendItems(fixture: ComponentFixture<any>): {
  label: string;
  hasErrorColor: boolean;
  hasConversionColor: boolean;
  hasFilteredColor: boolean;
  hasPattern: boolean;
}[] {
  const legendItemElements = fixture.debugElement.queryAll(
    By.css('.dt-legend-item'),
  );
  return legendItemElements.map((element) => {
    const label = element
      .query(By.css('.dt-legend-item-label'))
      .nativeElement.textContent.trim();
    const hasErrorColor = element
      .query(By.css('.dt-event-chart-legend-symbol'))
      .nativeElement.classList.toString()
      .includes('error');
    const hasConversionColor = element
      .query(By.css('.dt-event-chart-legend-symbol'))
      .nativeElement.classList.toString()
      .includes('conversion');
    const hasFilteredColor = element
      .query(By.css('.dt-event-chart-legend-symbol'))
      .nativeElement.classList.toString()
      .includes('filtered');
    const hasPattern =
      // eslint-disable-next-line
      element.query(
        By.css(
          '.dt-event-chart-legend-symbol .dt-event-chart-legend-symbol-pattern',
        ),
      ) !== null;
    return {
      label,
      hasErrorColor,
      hasConversionColor,
      hasFilteredColor,
      hasPattern,
    };
  });
}

function getLaneLabels(fixture: ComponentFixture<any>): string[] {
  const laneLabels = fixture.debugElement.queryAll(
    By.css('.dt-event-chart-lane-label'),
  );
  return laneLabels.map((text) => text.nativeElement.innerHTML.trim());
}

describe('DtEventChart', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DtEventChartModule],
      declarations: [
        EventChartStaticData,
        EventChartStaticDataWithLegendAndOverlay,
        EventChartDynamicData,
      ],
      providers: [{ provide: DT_UI_TEST_CONFIG, useValue: overlayConfig }],
    });
    TestBed.compileComponents();
  });

  beforeEach(inject([OverlayContainer], (oc: OverlayContainer) => {
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  describe('with static data and minimal configuration', () => {
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(EventChartStaticData);
      const canvas = fixture.debugElement.query(
        By.css('.dt-event-chart-canvas'),
      );
      // Mock the clientWidth function of the canvas, to accurately get
      // merging and rendering values. Otherwhise jsDom would return 0 for
      // clientWidth.
      jest
        .spyOn(canvas.nativeElement, 'clientWidth', 'get')
        .mockImplementation(() => 1024);
      fixture.detectChanges();
    });

    it('should create the dt-event-chart', () => {
      expect(fixture).toBeDefined();
    });

    it('should render the heatfields correctly', () => {
      const renderedFields =
        fixture.componentInstance._eventChartInstance._renderFields;
      expect(renderedFields).toHaveLength(3);
    });

    it('should render the events correctly', () => {
      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;
      // Expect the correct amount of dots being drawn
      expect(renderedEvents).toHaveLength(6);

      expect(renderedEvents[0]).toMatchObject({
        x1: 13,
        x2: 13,
        y: 73,
        pattern: true,
        color: 'default',
      });

      // Check points for bubble 1
      expect(renderedEvents[1].x1).toBeCloseTo(146, 0.5);
      expect(renderedEvents[1].x2).toBeCloseTo(146, 0.5);
      expect(renderedEvents[1].y).toBe(24);

      // Check points for bubble 2
      expect(renderedEvents[2].x1).toBeCloseTo(212.6, 0.5);
      expect(renderedEvents[2].x2).toBeCloseTo(212.6, 0.5);
      expect(renderedEvents[2].y).toBe(73);

      // Check points for bubble 3
      expect(renderedEvents[3].x1).toBeCloseTo(345.6, 0.5);
      expect(renderedEvents[3].x2).toBeCloseTo(345.6, 0.5);
      expect(renderedEvents[3].y).toBe(73);
      expect(renderedEvents[3].color).toContain('error');

      // Check points for bubble 4
      expect(renderedEvents[4].x1).toBeCloseTo(478.7, 0.5);
      expect(renderedEvents[4].x2).toBeCloseTo(678.3, 0.5);
      expect(renderedEvents[4].y).toBe(73);
      expect(renderedEvents[4].pattern).toBe(true);

      // Check points for bubble 5
      expect(renderedEvents[5].x1).toBeCloseTo(1011, 0.5);
      expect(renderedEvents[5].x2).toBeCloseTo(1011, 0.5);
      expect(renderedEvents[5].y).toBe(24);
    });

    it('should render the path correctly', () => {
      const path = getRenderedEventsPath(fixture);

      // Split the path into points and check
      const splitPath = path
        .replace(/ ([M,L,C,A])/gim, ' *$1')
        .split('*')
        .map((pathInstruction) => pathInstruction.trim())
        .map(
          (
            pathInstruction: string,
          ): {
            key: string;
            x: number;
            y: number;
          } => {
            const key = pathInstruction[0];
            const [x, y] = pathInstruction
              .slice(1)
              .split(' ')
              .map((directionInstruction: string): number =>
                parseFloat(directionInstruction),
              );
            return { key, x, y };
          },
        );

      // Expect instructions to be correct
      expect(splitPath.map((e) => e.key)).toEqual([
        'M',
        'L',
        'L',
        'L',
        'L',
        'M',
        'L',
      ]);

      // Expect x and y instructions to be close to what they should be
      expect(splitPath[0].x).toBeCloseTo(13);
      expect(splitPath[0].y).toBeCloseTo(73);

      expect(splitPath[1].x).toBeCloseTo(146.066666, 4);
      expect(splitPath[1].y).toBeCloseTo(24);

      expect(splitPath[2].x).toBeCloseTo(212.6, 4);
      expect(splitPath[2].y).toBeCloseTo(73);

      expect(splitPath[3].x).toBeCloseTo(345.6666666, 4);
      expect(splitPath[3].y).toBeCloseTo(73);

      expect(splitPath[4].x).toBeCloseTo(478.7333333, 4);
      expect(splitPath[4].y).toBeCloseTo(73);

      expect(splitPath[5].x).toBeCloseTo(678.33333333, 4);
      expect(splitPath[5].y).toBeCloseTo(73);

      expect(splitPath[6].x).toBeCloseTo(1011, 4);
      expect(splitPath[6].y).toBeCloseTo(24);
    });

    it('should render the correct lanes and lables', () => {
      const lanes = getLaneLabels(fixture);
      expect(lanes).toHaveLength(2);
      expect(lanes).toStrictEqual(['User event', 'XHR']);
    });

    it('should not have merge labels', () => {
      const mergeLables = getRenderedMergedTextLabels(fixture);
      expect(mergeLables).toHaveLength(0);
    });

    it('should not have legend items', () => {
      const legendItems = getLegendItems(fixture);
      expect(legendItems).toHaveLength(0);
    });
  });

  describe('with static data including legend and overlay', () => {
    let fixture;
    beforeEach(() => {
      fixture = TestBed.createComponent(
        EventChartStaticDataWithLegendAndOverlay,
      );
      const canvas = fixture.debugElement.query(
        By.css('.dt-event-chart-canvas'),
      );
      // Mock the clientWidth function of the canvas, to accurately get
      // merging and rendering values. Otherwhise jsDom would return 0 for
      // clientWidth.
      jest
        .spyOn(canvas.nativeElement, 'clientWidth', 'get')
        .mockImplementation(() => 1024);
      // Reset selected property.
      fixture.componentInstance.selected = undefined;
      fixture.detectChanges();
    });

    it('should create a event chart with the setup configuration', () => {
      expect(fixture).toBeDefined();
    });

    it('should have the correct legends', () => {
      const legends = getLegendItems(fixture);

      // Legend for the default duration event
      expect(legends[0]).toMatchObject({
        label: 'This is the default duration legend',
        hasErrorColor: false,
        hasConversionColor: false,
        hasFilteredColor: false,
        hasPattern: true,
      });

      // Default label for a single event.
      expect(legends[1]).toMatchObject({
        label: 'This is the default legend',
        hasErrorColor: false,
        hasConversionColor: false,
        hasFilteredColor: false,
        hasPattern: false,
      });

      // Legend for the error event
      expect(legends[2]).toMatchObject({
        label: 'This is the error legend',
        hasErrorColor: true,
        hasConversionColor: false,
        hasFilteredColor: false,
        hasPattern: true,
      });
    });

    it('should have an overlay container defined', () => {
      expect(overlayContainer).toBeDefined();
    });

    it('should display an overlay when hovering over a point', () => {
      const firstBubble = fixture.debugElement.query(
        By.css('.dt-event-chart-event'),
      );
      dispatchFakeEvent(firstBubble.nativeElement, 'mouseenter');
      fixture.detectChanges();

      const overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );
      expect(overlayPane).toBeDefined();

      const overlayContent = (overlayPane!.textContent || '').trim();
      expect(overlayContent).toBe('1');
    });

    it('should remove the overlay when moving the mouse away from the point', () => {
      const firstBubble = fixture.debugElement.query(
        By.css('.dt-event-chart-event'),
      );
      let overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );

      dispatchFakeEvent(firstBubble.nativeElement, 'mouseenter');
      fixture.detectChanges();
      overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );

      dispatchFakeEvent(firstBubble.nativeElement, 'mouseleave');
      fixture.detectChanges();
      overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );

      expect(overlayPane).toBeNull();
    });

    it('should call bound function when selecting an eventBubble', () => {
      jest.spyOn(fixture.componentInstance, 'logSelected');
      const firstBubble = fixture.debugElement.query(
        By.css('.dt-event-chart-event'),
      );
      dispatchFakeEvent(firstBubble.nativeElement, 'click');

      expect(fixture.componentInstance.logSelected).toHaveBeenCalledWith(
        expect.any(DtEventChartSelectedEvent),
      );
      // Check if the now selected element fits the elements
      expect(fixture.componentInstance.selected.sources).toHaveLength(1);
      expect(fixture.componentInstance.selected.sources[0]).toMatchObject({
        _duration: 0,
        _value: 0,
        lane: 'xhr',
        data: '1',
      });
    });

    it('should select an event when a bubble is clicked', () => {
      const firstBubble = fixture.debugElement.query(
        By.css('.dt-event-chart-event'),
      );
      dispatchFakeEvent(firstBubble.nativeElement, 'click');
      fixture.detectChanges();
      expect(firstBubble.nativeElement.classList).toContain(
        'dt-event-chart-event-selected',
      );
    });

    it('should propagate attribute to overlay if `dt-ui-test-id` is provided', () => {
      const firstBubble = fixture.debugElement.query(
        By.css('.dt-event-chart-event'),
      );
      dispatchFakeEvent(firstBubble.nativeElement, 'mouseenter');
      fixture.detectChanges();

      const overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );

      expect(overlayPane!.outerHTML).toContain(
        'dt-ui-test-id="event-chart-overlay"',
      );
    });
  });

  describe('with dynamic data', () => {
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(EventChartDynamicData);
      const canvas = fixture.debugElement.query(
        By.css('.dt-event-chart-canvas'),
      );
      // Mock the clientWidth function of the canvas, to accurately get
      // merging and rendering values. Otherwhise jsDom would return 0 for
      // clientWidth.
      jest
        .spyOn(canvas.nativeElement, 'clientWidth', 'get')
        .mockImplementation(() => 1024);
      // Reset selected property.
      fixture.componentInstance.selected = undefined;
      fixture.detectChanges();
    });

    it('should create the chart correctly with dynamic content-children', () => {
      expect(fixture).toBeDefined();
    });

    it('should render the correct amount of events', () => {
      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;

      // Expect the correct amount of dots being drawn
      expect(renderedEvents).toHaveLength(7);

      // Expect the event to have a error color
      expect(renderedEvents[3].color).toBe('error');
      // Expect the event to have a conversion color
      expect(renderedEvents[4].color).toBe('conversion');
      // Expect the event to have a duration
      expect(renderedEvents[5].pattern).toBe(true);
    });

    it('should render the correct lanes and lables', () => {
      const lanes = getLaneLabels(fixture);
      expect(lanes).toHaveLength(2);
      expect(lanes).toStrictEqual(['User event', 'XHR']);
    });

    it('should update the rendered events after one event is removed', () => {
      const newEvents = [...fixture.componentInstance._events];
      newEvents.splice(2, 1);
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();

      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;
      // Expect the length to decrease.
      expect(renderedEvents).toHaveLength(6);

      // Expect the event to have a error color
      expect(renderedEvents[2].color).toBe('error');
      // Expect the event to have a conversion color
      expect(renderedEvents[3].color).toBe('conversion');
      // Expect the event to have a duration
      expect(renderedEvents[4].pattern).toBe(true);
    });

    it('should update the rendered events if one event is added', () => {
      const newEvents = [...fixture.componentInstance._events];
      newEvents.push({
        value: 150,
        duration: 0,
        lane: 'user-event',
        color: 'default',
        data: 8,
      });
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();
      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;
      // Expect the length to increase.
      expect(renderedEvents).toHaveLength(8);
    });

    it('should update the rendered events if one event is added and instantly merged', () => {
      const newEvents = [...fixture.componentInstance._events];
      newEvents.push({
        value: 15.5,
        duration: 0,
        lane: 'xhr',
        color: 'default',
        data: 8,
      });
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();
      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;
      // Expect the length to stay the same, as the newly added one should be merged.
      expect(renderedEvents).toHaveLength(7);
    });

    it('should have merged labels, if events are merged', () => {
      const newEvents = [...fixture.componentInstance._events];
      newEvents.push({
        value: 15.5,
        duration: 0,
        lane: 'xhr',
        color: 'default',
        data: 8,
      });
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();

      const mergedLables = getRenderedMergedTextLabels(fixture);
      expect(mergedLables).toHaveLength(1);
      expect(mergedLables[0]).toBe('2');
    });

    it('should receive the merged data if a merged event is clicked', () => {
      jest.spyOn(fixture.componentInstance, 'logSelected');
      const newEvents = [...fixture.componentInstance._events];
      newEvents.push({
        value: 15.5,
        duration: 0,
        lane: 'xhr',
        color: 'default',
        data: 8,
      });
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();

      const mergedBubble = fixture.debugElement.queryAll(
        By.css('.dt-event-chart-event'),
      )[1];
      dispatchFakeEvent(mergedBubble.nativeElement, 'click');

      expect(fixture.componentInstance.logSelected).toHaveBeenCalledWith(
        expect.any(DtEventChartSelectedEvent),
      );
      // Check if the now selected element contains the expected data.
      expect(fixture.componentInstance.selected.sources).toHaveLength(2);
      expect(fixture.componentInstance.selected.sources[0]).toMatchObject({
        _duration: 0,
        _value: 15,
        lane: 'xhr',
        data: 2,
      });
      expect(fixture.componentInstance.selected.sources[1]).toMatchObject({
        _duration: 0,
        _value: 15.5,
        lane: 'xhr',
        data: 8,
      });
    });

    it('should show the merged data in the overlay when hovered', () => {
      const newEvents = [...fixture.componentInstance._events];
      newEvents.push({
        value: 15.5,
        duration: 0,
        lane: 'xhr',
        color: 'default',
        data: 8,
      });
      fixture.componentInstance._events = newEvents;
      fixture.detectChanges();

      const mergedBubble = fixture.debugElement.queryAll(
        By.css('.dt-event-chart-event'),
      )[1];
      dispatchFakeEvent(mergedBubble.nativeElement, 'mouseenter');
      fixture.detectChanges();

      const overlayPane = overlayContainerElement.querySelector(
        '.dt-event-chart-overlay-panel',
      );
      expect(overlayPane).toBeDefined();

      const overlayContent = (overlayPane!.textContent || '').trim();
      expect(overlayContent).toContain('2');
      expect(overlayContent).toContain('8');
    });

    it('should render the correct legend items', () => {
      const legendItems = getLegendItems(fixture);
      expect(legendItems).toHaveLength(2);
      expect(legendItems[0].label).toBe('This is the default duration legend');
      expect(legendItems[1].label).toBe('This is the error legend');
    });

    it('should update the legends if they are changed dynamically', () => {
      fixture.componentInstance._errorLegendEnabled = false;
      fixture.detectChanges();
      const legendItems = getLegendItems(fixture);
      expect(legendItems).toHaveLength(1);
      expect(legendItems[0].label).toBe('This is the default duration legend');
    });

    it('should update the legends if a binding inside changes', () => {
      fixture.componentInstance._durationLabel = 'Updated label';
      fixture.detectChanges();
      const legendItems = getLegendItems(fixture);
      expect(legendItems).toHaveLength(2);
      expect(legendItems[0].label).toBe('Updated label');
      expect(legendItems[1].label).toBe('This is the error legend');
    });

    it('should react to changing lanes', () => {
      fixture.componentInstance._userEventsLaneEnabled = false;
      fixture.detectChanges();
      const lanes = getLaneLabels(fixture);
      expect(lanes).toHaveLength(1);
      expect(lanes).toStrictEqual(['XHR']);

      // Events on lanes, that are not defined, should not be rendered.
      const renderedEvents =
        fixture.componentInstance._eventChartInstance._renderEvents;
      expect(renderedEvents).toHaveLength(5);
    });
  });

  describe('selection', () => {
    let fixture;

    beforeEach(() => {
      fixture = TestBed.createComponent(EventChartStaticData);
      const canvas = fixture.debugElement.query(
        By.css('.dt-event-chart-canvas'),
      );
      // Mock the clientWidth function of the canvas, to accurately get
      // merging and rendering values. Otherwhise jsDom would return 0 for
      // clientWidth.
      jest
        .spyOn(canvas.nativeElement, 'clientWidth', 'get')
        .mockImplementation(() => 1024);
      fixture.detectChanges();
    });

    it('should not have anything selected initially', () => {
      const selectedEvent = fixture.debugElement.query(
        By.css('.dt-event-chart-style-selected'),
      );
      expect(selectedEvent).toBeNull();
    });

    it('should select the first event programmatically', () => {
      fixture.componentInstance._eventChartInstance.select(0);
      fixture.detectChanges();
      const events = fixture.debugElement.queryAll(
        By.css('.dt-event-chart-event'),
      );
      expect(events[0].nativeElement.classList).toContain(
        'dt-event-chart-event-selected',
      );
    });

    it('should deselect the first event programmatically', () => {
      fixture.componentInstance._eventChartInstance.select(0);
      fixture.detectChanges();
      fixture.componentInstance._eventChartInstance.deselect();
      fixture.detectChanges();
      const selectedEvent = fixture.debugElement.query(
        By.css('.dt-event-chart-style-selected'),
      );
      expect(selectedEvent).toBeNull();
    });

    describe('x-axis', () => {
      it('should have formatted ticks for seconds', () => {
        const axisLabels = fixture.debugElement
          .queryAll(By.css('.dt-event-chart-tick-label'))
          .map((el) => el.nativeElement.textContent.trim());

        expect(axisLabels).toEqual([
          '0 s',
          '15 s',
          '30 s',
          '45 s',
          '1 min',
          '1 min 15 s',
        ]);
      });

      it('should have formatted ticks for bigger than seconds', () => {
        fixture = TestBed.createComponent(EventChartDynamicData);
        const canvas = fixture.debugElement.query(
          By.css('.dt-event-chart-canvas'),
        );
        // Mock the clientWidth function of the canvas, to accurately get
        // merging and rendering values. Otherwhise jsDom would return 0 for
        // clientWidth.
        jest
          .spyOn(canvas.nativeElement, 'clientWidth', 'get')
          .mockImplementation(() => 1024);
        fixture.detectChanges();

        const axisLabels = fixture.debugElement
          .queryAll(By.css('.dt-event-chart-tick-label'))
          .map((el) => el.nativeElement.textContent.trim());

        expect(axisLabels).toEqual([
          '0 s',
          '0.02 s',
          '0.04 s',
          '0.06 s',
          '0.08 s',
          '0.1 s',
        ]);
      });
    });
  });
});

/** Test component that contains an DtEventChart. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-event-chart>
      <dt-event-chart-field
        start="0"
        end="35000"
        color="default"
        [data]="1"
      ></dt-event-chart-field>
      <dt-event-chart-field
        start="45000"
        end="65000"
        color="error"
        [data]="2"
      ></dt-event-chart-field>
      <dt-event-chart-field
        start="65000"
        color="default"
        [data]="3"
      ></dt-event-chart-field>
      <dt-event-chart-event value="0" lane="xhr"></dt-event-chart-event>
      <dt-event-chart-event value="15000" lane="xhr"></dt-event-chart-event>
      <dt-event-chart-event
        value="25000"
        lane="xhr"
        color="error"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="10000"
        lane="user-event"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="35000"
        lane="xhr"
        duration="15000"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="75000"
        lane="user-event"
      ></dt-event-chart-event>

      <dt-event-chart-lane
        name="xhr"
        label="XHR"
        pattern="true"
      ></dt-event-chart-lane>
      <dt-event-chart-lane
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>
    </dt-event-chart>
  `,
})
class EventChartStaticData {
  @ViewChild(DtEventChart, { static: true })
  _eventChartInstance: DtEventChart<any>;
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-event-chart dt-ui-test-id="event-chart">
      <dt-event-chart-event
        value="0"
        lane="xhr"
        data="1"
        (selected)="logSelected($event)"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="15"
        lane="xhr"
        data="3"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="25"
        lane="xhr"
        color="error"
        data="2"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="10"
        lane="user-event"
        data="4"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="35"
        lane="xhr"
        duration="15"
      ></dt-event-chart-event>
      <dt-event-chart-event
        value="75"
        lane="user-event"
        data="5"
      ></dt-event-chart-event>

      <dt-event-chart-lane
        name="xhr"
        label="XHR"
        pattern="true"
      ></dt-event-chart-lane>
      <dt-event-chart-lane
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>

      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']">
        This is the default legend
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr']" pattern>
        This is the default duration legend
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr']" pattern color="error">
        This is the error legend
      </dt-event-chart-legend-item>

      <ng-template dtEventChartOverlay let-tooltip>
        <div *ngFor="let t of tooltip">
          {{ t.data }}
        </div>
      </ng-template>
    </dt-event-chart>
  `,
})
class EventChartStaticDataWithLegendAndOverlay {
  selected;

  @ViewChild(DtEventChart, { static: true })
  _eventChartInstance: DtEventChart<any>;

  logSelected(selected: DtEventChartSelectedEvent<string>): void {
    this.selected = selected;
  }
}

@Component({
  selector: 'dt-test-app',
  template: `
    <dt-event-chart>
      <dt-event-chart-field
        *ngFor="let field of _heatfields"
        [start]="field.start"
        [end]="field.end"
        [color]="field.color"
        [data]="field.data"
      ></dt-event-chart-field>

      <dt-event-chart-event
        *ngFor="let event of _events"
        [value]="event.value"
        [duration]="event.duration"
        [lane]="event.lane"
        [color]="event.color"
        (selected)="logSelected($event)"
        [data]="event.data"
      ></dt-event-chart-event>

      <dt-event-chart-lane
        name="xhr"
        label="XHR"
        pattern="true"
      ></dt-event-chart-lane>
      <dt-event-chart-lane
        *ngIf="_userEventsLaneEnabled"
        name="user-event"
        label="User event"
      ></dt-event-chart-lane>

      <dt-event-chart-legend-item [lanes]="['xhr', 'user-event']">
        This is the default legend
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item [lanes]="['xhr']" pattern>
        {{ _durationLabel }}
      </dt-event-chart-legend-item>
      <dt-event-chart-legend-item
        *ngIf="_errorLegendEnabled"
        [lanes]="['xhr', 'user-event']"
        color="error"
      >
        This is the error legend
      </dt-event-chart-legend-item>

      <ng-template dtEventChartOverlay let-tooltip>
        <div *ngFor="let t of tooltip">
          {{ t.data }}
        </div>
      </ng-template>

      <ng-template dtEventChartHeatfieldOverlay let-tooltip>
        <div *ngFor="let t of tooltip">
          {{ t.data }}
        </div>
      </ng-template>
    </dt-event-chart>
  `,
})
class EventChartDynamicData {
  @ViewChild(DtEventChart, { static: true })
  _eventChartInstance: DtEventChart<any>;

  selected;
  logSelected(selected: DtEventChartSelectedEvent<number>): void {
    this.selected = selected;
  }

  _userEventsLaneEnabled = true;

  _errorLegendEnabled = true;

  _durationLabel = 'This is the default duration legend';

  _events = [
    {
      value: 0,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 1,
    },
    {
      value: 15,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 2,
    },
    {
      value: 35,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 3,
    },
    {
      value: 45,
      duration: 0,
      lane: 'user-event',
      color: 'error',
      data: 4,
    },
    {
      value: 65,
      duration: 0,
      lane: 'user-event',
      color: 'conversion',
      data: 5,
    },
    {
      value: 80,
      duration: 20,
      lane: 'xhr',
      color: 'default',
      data: 6,
    },
    {
      value: 110,
      duration: 0,
      lane: 'xhr',
      color: 'default',
      data: 7,
    },
  ];

  _heatfields = [
    {
      start: 0,
      end: 35,
      color: 'default',
      data: 1,
    },
    {
      start: 45,
      end: 65,
      color: 'error',
      data: 2,
    },
    {
      start: 65,
      color: 'default',
      data: 3,
    },
  ];
}
