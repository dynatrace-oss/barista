import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtButtongroupModule } from './index';

describe('DtButton', () => {
});

/** Test component that contains an DtButton. */
@Component({
  selector: 'dt-test-app',
  template: `
    <button dt-button type="button" (click)="increment()"
      [disabled]="isDisabled">
      Go
    </button>
    <a href="http://www.dynatrace.com" dt-button [disabled]="isDisabled">
      Link
    </a>
  `,
})
class TestApp {
  clickCount = 0;
  isDisabled = false;
  rippleDisabled = false;

  increment(): void {
    this.clickCount++;
  }
}
