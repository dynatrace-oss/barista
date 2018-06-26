import {Component} from '@angular/core';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DtCopyClipboardModule, DtIconModule} from './index';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DtCopyClipboard', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtCopyClipboardModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [TestApp, TestApp2],
    });

    TestBed.compileComponents();
  }));

  it('should trigger callback', fakeAsync((): void => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick(1500);
    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0, 'At least 1 copy must be called');

  }));

  it('should set checkmark to visible and visible afterwards', fakeAsync((): void => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick(200);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.dt-button-icon')) !== null).toBeTruthy('Icon should be visible');
    tick(2000);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.dt-button-icon'))).toBeNull('Icon should be invisible');
  }));

  it('should not trigger callback', fakeAsync((): void => {
    const fixture = TestBed.createComponent(TestApp2);
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    tick(1500);
    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBe(0, 'disabled copy to clipboards container should not trigger');
  }));

});

/** Test component that contains an DtCopyComponent. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-copy-clipboard (copied)="increaseEventCount();">
      <input dtInput value="https://context.dynatrace.com"/>
      <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
    </dt-copy-clipboard>`,
})
class TestApp {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}

@Component({
  selector: 'dt-test-app2',
  template: `
    <dt-copy-clipboard [disabled]="true" (copied)="increaseEventCount();">
      <input dtInput value="https://context.dynatrace.com"/>
      <dt-copy-clipboard-label>Copy</dt-copy-clipboard-label>
    </dt-copy-clipboard>`,
})
class TestApp2 {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}
