// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { PortalModule } from '@angular/cdk/portal';
import { DtMicroChartBarSeriesSVG } from './bar';
import { createComponent } from '../../../testing/create-component';

describe('DtMicroChartBarSvg', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        CommonModule,
        PortalModule,
      ],
      declarations: [
        SimpleBarSeries,
        DtMicroChartBarSeriesSVG,
      ],
    }).compileComponents();
  }));

  describe('initial state', () => {
    let fixture: ComponentFixture<SimpleBarSeries>;

    beforeEach(fakeAsync(() => {
      fixture = createComponent(SimpleBarSeries);
    }));

    it('should exist', () => {
      expect(fixture).toBeTruthy();
    });

    it('should render bars', () => {
      const column = fixture.debugElement.query(By.css('.dt-micro-chart-bar'));
      const x = column.nativeElement.getAttribute('x');
      const y = column.nativeElement.getAttribute('y');
      const width = column.nativeElement.getAttribute('width');
      const height = column.nativeElement.getAttribute('height');
      expect(x).toBe('0');
      expect(y).toBe('0');
      expect(width).toBe('97');
      expect(height).toBe('13');
    });
  });

  describe('changed state', () => {
    let fixture: ComponentFixture<SimpleBarSeries>;

    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(SimpleBarSeries);
      fixture.detectChanges();
    }));

  });
});

@Component({
  selector: 'dt-simple-column-series',
  template: `
    <svg>
      <svg:g dt-micro-chart-bar-series [points]="points"></svg:g>
    </svg>
  `,
})
class SimpleBarSeries {
  points = [
    { x: 0, y: 0, width: 97, height: 13 },
    { x: 0, y: 17, width: 216, height: 13 },
    { x: 0, y: 34, width: 270, height: 13 },
    { x: 0, y: 51, width: 1, height: 13 },
    { x: 0, y: 68, width: 1, height: 13 },
    { x: 0, y: 86, width: 54, height: 13 },
  ];
}
