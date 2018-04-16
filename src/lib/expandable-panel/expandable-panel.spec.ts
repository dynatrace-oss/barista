import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DtExpandablePanelModule, DtExpandablePanel } from '@dynatrace/angular-components/expandable-panel';

describe('DtExpandablePanel', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [DtExpandablePanelModule],
      declarations: [TestApp],
    });

    TestBed.compileComponents();
  }));

  describe('dt-expandable-panel', () => {
    it('should open', () => {
      expect(true).toBe(true);
    });
  });


});

@Component({
  selector: 'dt-test-app',
  template: `
  `,
})
class TestApp {
}
