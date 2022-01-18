/**
 * @license
 * Copyright 2021 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component } from '@angular/core';
import { TestBed, waitForAsync, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DtButtonModule } from '@dynatrace/barista-components/button';
import { DtCopyToClipboardModule } from './copy-to-clipboard-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';
import { DtInputModule } from '@dynatrace/barista-components/input';

import { createComponent } from '@dynatrace/testing/browser';

describe('DtCopyToClipboard', () => {
  const execCommandMock = jest.fn().mockReturnValue(true);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          DtInputModule,
          DtButtonModule,
          DtCopyToClipboardModule,
          HttpClientTestingModule,
          DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
        ],
        declarations: [CallbackBehaviorTestApp, DelayedCallbackBehaviorTestApp],
      });
      TestBed.compileComponents();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document.execCommand = execCommandMock;
    }),
  );

  it('should not trigger a copy action on render', (): void => {
    createComponent(CallbackBehaviorTestApp);
    expect(execCommandMock).not.toHaveBeenCalled();
  });

  it('should trigger callback - at least 1 copy must be called', (): void => {
    const fixture = createComponent(CallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(
      By.css('.dt-copy-to-clipboard-btn-button'),
    );
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0);
  });

  it('should trigger a delayed callback - at least 1 copy must be called', fakeAsync((): void => {
    const fixture = createComponent(DelayedCallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(
      By.css('.dt-copy-to-clipboard-btn-button'),
    );
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toEqual(0);

    tick(1200);
    fixture.detectChanges();
    expect(fixture.componentInstance.copyEventCount).toBeGreaterThan(0);
  }));

  it('should set checkmark to visible and invisible afterwards', fakeAsync((): void => {
    const fixture = createComponent(CallbackBehaviorTestApp);
    const buttonDebugElement = fixture.debugElement.query(
      By.css('.dt-copy-to-clipboard-btn-button'),
    );
    buttonDebugElement.nativeElement.dispatchEvent(new Event('click'));

    fixture.detectChanges();
    const checkIfIconExist = fixture.debugElement.query(
      By.css('.dt-button-icon'),
    );
    expect(checkIfIconExist).not.toBeNull();
    tick(1200); // wait at least 800ms until the icon should automatically disappear
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.dt-button-icon'))).toBeNull();
  }));
});

/** Test component that contains an DtCopyComponent. */
@Component({
  selector: 'dt-test-app',
  template: `
    <dt-copy-to-clipboard (copied)="increaseEventCount()">
      <input dtInput value="https://context.dynatrace.com" />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
  `,
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
    <dt-copy-to-clipboard (afterCopy)="increaseEventCount()">
      <input dtInput value="https://context.dynatrace.com" />
      <dt-copy-to-clipboard-label>Copy</dt-copy-to-clipboard-label>
    </dt-copy-to-clipboard>
  `,
})
class DelayedCallbackBehaviorTestApp {
  copyEventCount = 0;

  increaseEventCount(): void {
    this.copyEventCount++;
  }
}
