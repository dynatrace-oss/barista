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
      declarations: [TestApp, TestApp2, TestApp3],
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

  it('should switch to success message', (): void => {
    const fixture = TestBed.createComponent(TestApp3);
    fixture.detectChanges();
    const labelElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-label span'));
    labelElement.nativeElement.dispatchEvent(new Event('click'));
    fixture.detectChanges();

    const successElement = fixture.debugElement.query(By.css('.dt-copy-clipboard-success'));
    expect(successElement.nativeElement.innerText).toBe('success', 'Success should be visible');
  });
});

/** Test component that contains an DtCopyComponent. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-copy-clipboard (copied)="increaseEventCount();">
      <input dtInput value="https://context.dynatrace.com"/>
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
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
      <dt-copy-clipboard-btn>Copy</dt-copy-clipboard-btn>
    </dt-copy-clipboard>`,
})
class TestApp2 {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}

@Component({
  selector: 'dt-test-app3',
  template: `
    <dt-copy-clipboard>
      <dt-copy-clipboard-source>https://textclick.dyntrace.com</dt-copy-clipboard-source>
      <dt-copy-clipboard-label>click here, to copy</dt-copy-clipboard-label>
      <dt-copy-clipboard-success>success</dt-copy-clipboard-success>
    </dt-copy-clipboard>`,
})
class TestApp3 {
  copyEventCount = 0;
}
