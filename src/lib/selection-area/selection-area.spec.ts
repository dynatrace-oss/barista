import { async, TestBed } from '@angular/core/testing';
import { DtSelectionAreaModule } from '@dynatrace/angular-components';
import { Component, ViewChild } from '@angular/core';
import { DtButtonModule } from '../button';

fdescribe('DtSelectionArea', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtSelectionAreaModule,
        DtButtonModule,
      ],
      declarations: [BasicTest],
    });

    TestBed.compileComponents();
  }));

  it('should make the origin tabable when a selection area is attached', () => {
    const fixture = TestBed.createComponent(BasicTest);
    fixture.detectChanges();
    const origin = fixture.componentInstance.origin;
    expect(origin.getAttribute('tabindex')).toBeDefined();
  });

});

@Component({
  template: `
  <div class="origin" #origin></div>
  <dt-selection-area [origin]="origin" (changed)="handleChange($event)">
    Some basic overlay content 
    <dt-selection-area-actions>
      <button dt-button>Zoom in</button>
    </dt-selection-area-actions>
  </dt-selection-area>
  `,
})
export class BasicTest {
  @ViewChild('origin') origin: HTMLElement;
}
