// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  Component,
  ViewChild,
  TemplateRef,
  NgZone,
  AfterViewInit,
} from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
} from '@angular/core/testing';
import { MockNgZone } from '../../../testing/mock-ng-zone';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtMicroChartColumnSeriesSVG } from './column';
import { createComponent } from '../../../testing/create-component';

describe('DtMicroChartColumnSvg', () => {
  let zone: MockNgZone;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, PortalModule],
      declarations: [SimpleColumnSeries, DtMicroChartColumnSeriesSVG],
      providers: [
        { provide: NgZone, useFactory: () => (zone = new MockNgZone()) },
      ],
    }).compileComponents();
  }));

  describe('initial state', () => {
    let fixture: ComponentFixture<SimpleColumnSeries>;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleColumnSeries);
    }));

    it('should exist', () => {
      expect(fixture).toBeTruthy();
    });

    it('should render columns ', () => {
      const column = fixture.debugElement.query(
        By.css('.dt-micro-chart-column')
      );
      const x = column.nativeElement.getAttribute('x');
      const y = column.nativeElement.getAttribute('y');
      const width = column.nativeElement.getAttribute('width');
      const height = column.nativeElement.getAttribute('height');
      expect(x).toBe('0');
      expect(y).toBe('64');
      expect(width).toBe('24');
      expect(height).toBe('36');
    });

    it('should render extreme highlights', () => {
      const highlightMarker = fixture.debugElement.queryAll(
        By.css('.dt-micro-chart-column-extreme')
      );
      expect(highlightMarker.length).toBe(2);
    });

    it('should have the initial min template applied', () => {
      fixture.detectChanges();
      const minOutlet = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel')
      );
      expect(minOutlet.nativeElement.textContent.trim()).toBe(
        'Min template 60'
      );
    });

    it('should have two extreme labels at the right position', () => {
      fixture.detectChanges();
      zone.simulateZoneExit();
      const minLabel = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel-min')
      );
      expect(minLabel.nativeElement.getAttribute('x')).toBe('0');
      expect(minLabel.nativeElement.getAttribute('y')).toBe('64');
      expect(minLabel.nativeElement.getAttribute('text-anchor')).toBe('start');

      const maxLabel = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel-max')
      );
      expect(maxLabel.nativeElement.getAttribute('x')).toBe('147');
      expect(maxLabel.nativeElement.getAttribute('y')).toBe('99');
      expect(maxLabel.nativeElement.getAttribute('text-anchor')).toBe('middle');
    });
  });

  describe('changed state', () => {
    let fixture: ComponentFixture<SimpleColumnSeries>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleColumnSeries);
      fixture.detectChanges();
    }));

    it('should not render extremes if set to false', () => {
      fixture.componentInstance.highlightExtremes = false;
      fixture.detectChanges();
      const highlightMarker = fixture.debugElement.queryAll(
        By.css('.dt-micro-chart-line-extreme')
      );
      expect(highlightMarker.length).toBe(0);
    });

    it('should have update min template', () => {
      fixture.componentInstance.minTemplate =
        fixture.componentInstance.updatedMinTemplate;
      fixture.detectChanges();
      const minOutlet = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel')
      );
      expect(minOutlet.nativeElement.textContent.trim()).toBe(
        'Updated template 60'
      );
    });

    it('should update label positions after updating extremes', () => {
      fixture.componentInstance.extremes = {
        min: { x: 0, y: 50, height: 36, width: 24 },
        minAnchor: { x: 0, y: 50 },
        minValue: 50,
        max: { x: 270, y: 100, height: 36, width: 24 },
        maxAnchor: { x: 270, y: 100 },
        maxValue: 100,
      };
      fixture.detectChanges();
      zone.simulateZoneExit();
      const minLabel = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel-min')
      );
      expect(minLabel.nativeElement.getAttribute('x')).toBe('0');
      expect(minLabel.nativeElement.getAttribute('y')).toBe('50');
      expect(minLabel.nativeElement.getAttribute('text-anchor')).toBe('start');

      const maxLabel = fixture.debugElement.query(
        By.css('.dt-micro-chart-column-extremelabel-max')
      );
      expect(maxLabel.nativeElement.getAttribute('x')).toBe('270');
      expect(maxLabel.nativeElement.getAttribute('y')).toBe('100');
      expect(maxLabel.nativeElement.getAttribute('text-anchor')).toBe('end');
    });
  });
});

@Component({
  selector: 'dt-simple-column-series',
  template: `
    <svg>
      <svg:g
        dt-micro-chart-column-series
        [points]="points"
        [highlightExtremes]="highlightExtremes"
        [minHighlightRectangle]="minHighlightRectangle"
        [maxHighlightRectangle]="maxHighlightRectangle"
        [extremes]="extremes"
        [minTemplate]="minTemplate"
        [maxTemplate]="maxTemplate"
        [extremes]="extremes"
        width="300"
      ></svg:g>
      <ng-template #initialMinTemplate let-min>
        Min template {{ min }}
      </ng-template>
      <ng-template #updatedMinTemplate let-min>
        Updated template {{ min }}
      </ng-template>
      <ng-template #maxTemplate let-max>Max template {{ max }}</ng-template>
    </svg>
  `,
})
class SimpleColumnSeries implements AfterViewInit {
  points = [
    { x: 0, y: 64, height: 36, width: 24 },
    { x: 49, y: 20, height: 80, width: 24 },
    { x: 98, y: 0, height: 100, width: 24 },
    { x: 147, y: 99, height: 1, width: 24 },
    { x: 196, y: 99, height: 1, width: 24 },
    { x: 245, y: 80, height: 20, width: 24 },
  ];
  // tslint:disable-next-line:no-any
  minTemplate: TemplateRef<any>;
  // tslint:disable-next-line:no-any
  @ViewChild('initialMinTemplate', { static: true })
  initialMinTemplate: TemplateRef<any>;
  // tslint:disable-next-line:no-any
  @ViewChild('updatedMinTemplate', { static: true })
  updatedMinTemplate: TemplateRef<any>;

  highlightExtremes = true;
  minHighlightRectangle = { x: 144, y: 96, width: 30, height: 7 };
  maxHighlightRectangle = { x: 95, y: -3, width: 30, height: 106 };

  extremes = {
    min: { x: 0, y: 64, height: 36, width: 24 },
    minAnchor: { x: 0, y: 64 },
    minValue: 60,
    max: { x: 147, y: 99, height: 1, width: 24 },
    maxAnchor: { x: 147, y: 99 },
    maxValue: 100,
  };

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.minTemplate = this.initialMinTemplate;
    });
  }
}
