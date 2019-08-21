// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtTimelineChartModule } from '@dynatrace/angular-components/timeline-chart';

import { createComponent } from '../../testing/create-component';

describe('DtTimelineChart', () => {
  let fixture: ComponentFixture<SimpleTestApp>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtTimelineChartModule],
      declarations: [SimpleTestApp],
    });

    TestBed.compileComponents();
    fixture = createComponent(SimpleTestApp);
    fixture.detectChanges();
  }));

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
