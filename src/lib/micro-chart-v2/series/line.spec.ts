import { Component, ViewChild, TemplateRef, NgZone } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { MockNgZone } from '../../../testing/mock-ng-zone';
import { By } from '@angular/platform-browser';
import objectContaining = jasmine.objectContaining;
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtMicroChartLineSeriesSVG } from './line';

// tslint:disable:no-magic-numbers

fdescribe('DtMicroChartLineSvg', () => {
  let zone: MockNgZone;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        PortalModule,
      ],
      declarations: [
        SimpleLineSeries,
        DtMicroChartLineSeriesSVG,
      ],
      providers: [
        { provide: NgZone, useFactory: () => zone = new MockNgZone() },
      ],
    }).compileComponents();
  }));

  describe('initial state', () => {
    let fixture: ComponentFixture<SimpleLineSeries>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleLineSeries);
      fixture.detectChanges();
    }));

    it('should exist', () => {
      expect(fixture).toBeTruthy();
    });

    it('should render a line with the path', () => {
      const line = fixture.debugElement.query(By.css('.dt-micro-chart-line'));
      const path = line.nativeElement.getAttribute('d');
      expect(path).toBe(fixture.componentInstance.path);
    });

    it('should render extreme highlights', () => {
      const highlightMarker = fixture.debugElement.queryAll(By.css('.dt-micro-chart-line-extreme'));
      expect(highlightMarker.length).toBe(2);
    });

    it('should have the initial min template applied', () => {
      fixture.detectChanges();
      const minOutlet = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel'));
      expect(minOutlet.nativeElement.textContent.trim()).toBe('Min template 60');
    });

    it('should have two extreme labels at the right position', () => {
      fixture.detectChanges();
      zone.simulateZoneExit();
      const minLabel = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel-min'));
      expect(minLabel.nativeElement.getAttribute('x')).toBe('270');
      expect(minLabel.nativeElement.getAttribute('y')).toBe('60');
      expect(minLabel.nativeElement.getAttribute('text-anchor')).toBe('end');

      const maxLabel = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel-max'));
      expect(maxLabel.nativeElement.getAttribute('x')).toBe('135');
      expect(maxLabel.nativeElement.getAttribute('y')).toBe('100');
      expect(maxLabel.nativeElement.getAttribute('text-anchor')).toBe('middle');
    });
  });

  describe('changed state', () => {
    let fixture: ComponentFixture<SimpleLineSeries>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleLineSeries);
      fixture.detectChanges();
    }));

    it('should not render extremes if set to false', () => {
      fixture.componentInstance.highlightExtremes = false;
      fixture.detectChanges();
      const highlightMarker = fixture.debugElement.queryAll(By.css('.dt-micro-chart-line-extreme'));
      expect(highlightMarker.length).toBe(0);
    });

    it('should have update min template', () => {
      fixture.componentInstance.minTemplate = fixture.componentInstance.updatedMinTemplate;
      fixture.detectChanges();
      const minOutlet = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel'));
      expect(minOutlet.nativeElement.textContent.trim()).toBe('Updated template 60');
    });

    it('should update label positions after updating extremes', () => {
      fixture.componentInstance.extremes = {
        min: { x: 0, y: 50 },
        minValue: 50,
        max: { x: 270, y: 100 },
        maxValue: 100,
      };
      fixture.detectChanges();
      zone.simulateZoneExit();
      const minLabel = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel-min'));
      expect(minLabel.nativeElement.getAttribute('x')).toBe('0');
      expect(minLabel.nativeElement.getAttribute('y')).toBe('50');
      expect(minLabel.nativeElement.getAttribute('text-anchor')).toBe('start');

      const maxLabel = fixture.debugElement.query(By.css('.dt-micro-chart-line-extremelabel-max'));
      expect(maxLabel.nativeElement.getAttribute('x')).toBe('270');
      expect(maxLabel.nativeElement.getAttribute('y')).toBe('100');
      expect(maxLabel.nativeElement.getAttribute('text-anchor')).toBe('end');
    });
  });
});

@Component({
  selector: 'dt-simple-line-series',
  template: `<svg>
<svg:g dt-micro-chart-line-series [points]="points" [path]="path" [highlightExtremes]="highlightExtremes" [minTemplate]="minTemplate" [maxTemplate]="maxTemplate" [extremes]="extremes" width=300></svg:g>
<ng-template #initialMinTemplate let-min>Min template {{min}}</ng-template>
<ng-template #updatedMinTemplate let-min>Updated template {{min}}</ng-template>
<ng-template #maxTemplate let-max>Max template {{max}}</ng-template>
</svg>`,
})
class SimpleLineSeries {
  points = [
    { x: 0, y: 75 },
    { x: 67.5, y: 0 },
    { x: 135, y: 100 },
    { x: 202.5, y: 100 },
    { x: 270, y: 60 },
  ];

  minTemplate: TemplateRef<any>;
  @ViewChild('initialMinTemplate') initialMinTemplate: TemplateRef<any>;
  @ViewChild('updatedMinTemplate') updatedMinTemplate: TemplateRef<any>;

  path = 'M0,75L67.5,0L135,100L202.5,100L270,60';

  highlightExtremes = true;

  extremes = {
    min: { x: 270, y: 60 },
    minValue: 60,
    max: { x: 135, y: 100 },
    maxValue: 100,
  };

  ngAfterViewInit(): void {
    Promise.resolve()
      .then(() => {
        this.minTemplate = this.initialMinTemplate;
      });
  }
}
