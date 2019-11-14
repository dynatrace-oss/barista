import { ComponentFixture, TestBed, async } from '@angular/core/testing';

import { BaIconColorWheel } from './icon-color-wheel';

describe('IconColorWheelComponent', () => {
  let component: BaIconColorWheel;
  let fixture: ComponentFixture<BaIconColorWheel>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BaIconColorWheel],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BaIconColorWheel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
