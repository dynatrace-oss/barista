import {HttpClientModule} from '@angular/common/http';
import {Component} from '@angular/core';
import {async, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DtCopyClipboardModule, DtIconModule} from './index';

describe('DtCopyClipboard', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtCopyClipboardModule,
        HttpClientModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [TestApp, TestApp2],
    });

    TestBed.compileComponents();
  }));

  it('should trigger callback', (done: DoneFn) => {
    const fixture = TestBed.createComponent(TestApp);
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    setTimeout(
      (): void => {
        fixture.detectChanges();
        expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0, 'At least 1 copy must be called');
        done();
      },
      1500);

  });

  it('should not trigger callback', (done: DoneFn): void => {
    const fixture = TestBed.createComponent(TestApp2);
    fixture.detectChanges();
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));
    setTimeout(
      (): void => {
        fixture.detectChanges();
        expect(fixture.componentInstance.copyEventCount).toBe(0, 'disabled copy to clipboards container should not trigger');
        done();
      },
      1500);
  });

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
    <dt-copy-clipboard [enabled]="false" (copied)="increaseEventCount();">
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
