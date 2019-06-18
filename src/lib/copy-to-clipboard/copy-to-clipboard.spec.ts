// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { Component } from '@angular/core';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtButtonModule, DtCopyToClipboardModule, DtIconModule, DtInputModule } from '@dynatrace/angular-components';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createComponent } from '../../testing/create-component';

describe('DtCopyToClipboard', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        DtInputModule,
        DtButtonModule,
        DtCopyToClipboardModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
      ],
      declarations: [CallbackBehaviorTestApp, DelayedCallbackBehaviorTestApp],
    });
    TestBed.compileComponents();
    // tslint:disable-next-line:no-any
    document.execCommand = (): boolean => true;
  }));

  it('should trigger callback - at least 1 copy must be called', (): void => {

    const fixture = createComponent(CallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-to-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0);

  });

  it('should trigger a delayed callback - at least 1 copy must be called', fakeAsync((): void => {
    const fixture = createComponent(DelayedCallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-to-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toEqual(0);

    tick(1200);
    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0);
  }));

  it('should set checkmark to visible and invisible afterwards', fakeAsync((): void => {
    const fixture = createComponent(CallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(By.css('.dt-copy-to-clipboard-btn-button'));
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    const checkIfIconExist = fixture.debugElement.query(By.css('.dt-button-icon'));
    expect(checkIfIconExist).not.toBeNull('Icon should be visible');
    tick(1200); // wait at least 800ms until the icon should automatically disappear
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.dt-button-icon'))).toBeNull('Icon should be invisible');
  }));

});

/** Test component that contains an DtCopyComponent. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-copy-to-clipboard (copied)="increaseEventCount();">
      <input dtInput value="https://context.dynatrace.com"/>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>`,
})
class CallbackBehaviorTestApp {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}

/** Test component that contains an DtCopyComponent. */
@Component({
  selector: 'dt-delayed-test-app',
  template: `
    <dt-copy-to-clipboard (afterCopy)="increaseEventCount();">
      <input dtInput value="https://context.dynatrace.com"/>
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>`,
})
class DelayedCallbackBehaviorTestApp {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}
