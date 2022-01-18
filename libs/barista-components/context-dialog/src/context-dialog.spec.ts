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

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer, OverlayConfig } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DtContextDialogModule } from './context-dialog-module';
import { DtIconModule } from '@dynatrace/barista-components/icon';

import {
  createComponent,
  dispatchKeyboardEvent,
} from '@dynatrace/testing/browser';
import {
  DT_UI_TEST_CONFIG,
  DtUiTestConfiguration,
} from '@dynatrace/barista-components/core';
import {
  DtContextDialog,
  DT_CONTEXT_DIALOG_CONFIG,
  _DT_CONTEXT_DIALOG_DEFAULT_CONSTRAINTS,
} from './context-dialog';
import { DtContextDialogTrigger } from './context-dialog-trigger';

describe('DtContextDialog', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  const overlayConfig: DtUiTestConfiguration = {
    attributeName: 'dt-ui-test-id',
    constructOverlayAttributeValue(attributeName: string): string {
      return `${attributeName}-overlay`;
    },
  };

  const overlayCustomConfig: OverlayConfig = {
    panelClass: 'my-fancy-panel-class',
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function configureDtContextDialogTestingModule(
    declarations: any[],
    providers: any[] = [],
  ): void {
    TestBed.configureTestingModule({
      imports: [
        DtContextDialogModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations,
      providers: [
        { provide: DT_UI_TEST_CONFIG, useValue: overlayConfig },
        { provide: DT_CONTEXT_DIALOG_CONFIG, useValue: overlayCustomConfig },
        ...providers,
      ],
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(
      waitForAsync(() => {
        configureDtContextDialogTestingModule([BasicContextDialog]);
      }),
    );

    it('should set a class on the overlay panel if a string is set on the input', () => {
      const fixture = createComponent(BasicContextDialog);
      fixture.componentInstance.contextDialog.open();
      fixture.detectChanges();
      const contextDialogPanel = overlayContainer
        .getContainerElement()
        .querySelector('.dt-context-dialog-content');
      expect(contextDialogPanel!.classList).toContain('someclass');
    });

    it('should set all classes on the overlay panel if an array of strings is set on the input', () => {
      const fixture = createComponent(BasicContextDialog);
      fixture.componentInstance.panelClass = ['more', 'evenmore'];
      fixture.componentInstance.contextDialog.open();
      fixture.detectChanges();
      const contextDialogPanel = overlayContainer
        .getContainerElement()
        .querySelector('.dt-context-dialog-content');
      expect(contextDialogPanel!.classList).toContain('more');
      expect(contextDialogPanel!.classList).toContain('evenmore');
    });

    it('should set the correct classes on the overlay panel when already open', () => {
      const fixture = createComponent(BasicContextDialog);
      fixture.componentInstance.contextDialog.open();
      fixture.detectChanges();
      fixture.componentInstance.panelClass = ['more', 'evenmore'];
      fixture.detectChanges();
      const contextDialogPanel = overlayContainer
        .getContainerElement()
        .querySelector('.dt-context-dialog-content');
      expect(contextDialogPanel!.classList).toContain('more');
      expect(contextDialogPanel!.classList).toContain('evenmore');
    });

    it('should set an additional class on the overlay panel when a class is provided in a custom overlay config', () => {
      const fixture = createComponent(BasicContextDialog);
      fixture.componentInstance.contextDialog.open();
      fixture.detectChanges();
      const contextDialogPanel = overlayContainer
        .getContainerElement()
        .querySelector('.cdk-overlay-pane');
      expect(contextDialogPanel!.classList).toContain('my-fancy-panel-class');
    });

    describe('accessibility', () => {
      describe('for context-dialog', () => {
        let fixture: ComponentFixture<BasicContextDialog>;
        let contextDialog: HTMLElement;
        let contextDialogDefaultTrigger: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = createComponent(BasicContextDialog);
          contextDialog = fixture.debugElement.query(
            By.css('.dt-context-dialog'),
          ).nativeElement;
          contextDialogDefaultTrigger = fixture.debugElement.query(
            By.css('.dt-context-dialog-trigger'),
          ).nativeElement;
        }));

        it('should set the role of the overlay to dialog', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          tick();
          const contextMenuPanel = fixture.debugElement.query(
            By.css('.dt-context-dialog-panel'),
          ).nativeElement;
          expect(contextMenuPanel.getAttribute('role')).toEqual('dialog');
        }));

        it('should have the dark theme class on the panel', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          tick();
          const contextDialogPanel = fixture.debugElement.query(
            By.css('.dt-context-dialog-panel'),
          ).nativeElement;
          expect(
            contextDialogPanel.classList.contains('dt-theme-dark'),
          ).toEqual(true);
        }));

        it('should support setting a custom aria-label for the trigger button', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(
            contextDialogDefaultTrigger.getAttribute('aria-label'),
          ).toEqual('Custom Label');
        }));

        it('should set the tabindex of the trigger to 0 by default', fakeAsync(() => {
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual(
            '0',
          );
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toBe(
            '3',
          );
        }));

        it('should set aria-disabled for disabled context dialog', fakeAsync(() => {
          expect(contextDialog.getAttribute('aria-disabled')).toEqual('false');
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(contextDialog.getAttribute('aria-disabled')).toEqual('true');
        }));

        it('should set the tabindex of the context dialog to -1 if disabled', fakeAsync(() => {
          fixture.componentInstance.disabled = true;
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual(
            '-1',
          );
          fixture.componentInstance.disabled = false;
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual(
            '0',
          );
        }));

        it('should be able to focus the context dialog default trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          tick();
          fixture.componentInstance.contextDialog.focus();
          tick();

          // Expected context Dialog trigger to be focused.
          expect(document.activeElement).toBe(contextDialogDefaultTrigger);
        }));

        it('should be able to show custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();

          const contextDialogCustomTrigger = fixture.debugElement.query(
            By.directive(DtContextDialogTrigger),
          );
          // Expected the DtContextDialogTrigger to display custom trigger button
          expect(contextDialogCustomTrigger).toBeTruthy();
          // Expected the DtContextDialogTrigger to hide default trigger button
          expect(contextDialogDefaultTrigger.hidden).toBeTruthy();
        }));

        it('should be able open context dialog by clicking custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();

          const contextDialogCustomTrigger = fixture.debugElement.query(
            By.directive(DtContextDialogTrigger),
          );
          contextDialogCustomTrigger.nativeElement.click();
          tick();
          // Expected the custom trigger to open the context dialog
          expect(
            fixture.componentInstance.contextDialog.isPanelOpen,
          ).toBeTruthy();
        }));

        it('should be able to focus the context dialog custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();
          const contextDialogCustomTrigger = fixture.debugElement.query(
            By.directive(DtContextDialogTrigger),
          ).nativeElement;
          document.body.focus(); // ensure that focus isn't on the trigger already
          tick();
          fixture.componentInstance.contextDialog.focus();
          tick();

          // Expected context Dialog custom trigger to be focused.
          expect(document.activeElement).toBe(contextDialogCustomTrigger);
        }));

        it('should be able to unregister a custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();
          // Expected context Dialog custom trigger to be assigned.
          expect(fixture.componentInstance.contextDialog.trigger).toBe(
            fixture.componentInstance.contextDialogTrigger,
          );
          fixture.componentInstance.contextDialogTrigger._unregisterFromDialog();
          fixture.detectChanges();
          const contextDialogDefaultTriggerComponent =
            fixture.componentInstance.contextDialog._defaultTrigger;

          // Expected to show default trigger button
          expect(contextDialogDefaultTrigger.hidden).toBeFalsy();
          // Expected context Dialog default trigger to be assigned.
          expect(fixture.componentInstance.contextDialog.trigger).toBe(
            contextDialogDefaultTriggerComponent,
          );
        }));

        it('should close the overlay when a custom trigger gets destroyed', () => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();
          fixture.componentInstance.contextDialog.open();
          let panel = overlayContainer
            .getContainerElement()
            .querySelector('.dt-context-dialog-panel');
          expect(panel).toBeDefined();
          fixture.componentInstance.customTrigger = false;
          fixture.detectChanges();
          panel = overlayContainer
            .getContainerElement()
            .querySelector('.dt-context-dialog-panel');
          expect(panel).toBeNull();
        });
        it('should dispose the overlay when the context dialog is destroyed', () => {
          fixture.componentInstance.contextDialog.open();
          let panel = overlayContainer
            .getContainerElement()
            .querySelector('.dt-context-dialog-panel');
          expect(panel).toBeDefined();
          fixture.destroy();
          panel = overlayContainer
            .getContainerElement()
            .querySelector('.dt-context-dialog-panel');
          expect(panel).toBeNull();
        });

        // eslint-disable-next-line
        it.skip('should focus the first interactive element when opening', fakeAsync(() => {
          // TODO: [e2e] focus can not be tested in jsdom environment
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();

          expect(document.activeElement).toBe(
            fixture.componentInstance.firstInteractive.nativeElement,
          );
        }));
      });
    });
    describe('blur behaviour for context-dialog', () => {
      let fixture: ComponentFixture<BasicContextDialog>;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicContextDialog);
        fixture.detectChanges();
      }));
      it('should close the context dialog on backdrop click', fakeAsync(() => {
        const contextDialog = fixture.componentInstance.contextDialog;
        contextDialog.open();
        fixture.detectChanges();
        tick();
        const backdrop = overlayContainer
          .getContainerElement()
          .querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();
        (backdrop! as HTMLElement).click();
        fixture.detectChanges();
        flush();
        expect(contextDialog.isPanelOpen).toBeFalsy();
      }));

      it('should close the context dialog on ESC and open it again on click', fakeAsync(() => {
        const contextDialog = fixture.componentInstance.contextDialog;
        contextDialog.open();
        fixture.detectChanges();
        tick();
        const backdrop = overlayContainer
          .getContainerElement()
          .querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();
        dispatchKeyboardEvent(backdrop!, 'keydown', ESCAPE);
        fixture.detectChanges();
        flush();
        expect(contextDialog.isPanelOpen).toBeFalsy();
        contextDialog.open();
        fixture.detectChanges();
        expect(
          overlayContainer
            .getContainerElement()
            .querySelector('.dt-context-dialog-panel'),
        ).toBeDefined();
      }));
    });
    describe('propagate attribute to overlay', () => {
      let fixture;
      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicContextDialog);
        fixture.detectChanges();
      }));
      // eslint-disable-next-line
      it('should propagate attribute to overlay when `dt-ui-test-id` is provided', fakeAsync(() => {
        const contextDialog = fixture.componentInstance.contextDialog;
        contextDialog.open();
        fixture.detectChanges();
        tick();
        expect(overlayContainerElement.innerHTML).toContain(
          'dt-ui-test-id="context-dialog-overlay"',
        );
      }));
    });
  });

  describe('config', () => {
    it(
      'should have no maxWidth set if it is explicitly removed from the config',
      waitForAsync(() => {
        configureDtContextDialogTestingModule(
          [BasicContextDialog],
          [
            {
              provide: DT_CONTEXT_DIALOG_CONFIG,
              useValue: { maxWidth: undefined },
            },
          ],
        );

        const fixture = createComponent(BasicContextDialog);
        fixture.componentInstance.contextDialog.open();
        fixture.detectChanges();
        const cdkOverlayPane = overlayContainer
          .getContainerElement()
          .querySelector('.cdk-overlay-pane');
        expect(cdkOverlayPane?.getAttribute('style')).not.toContain(
          `max-width: ${_DT_CONTEXT_DIALOG_DEFAULT_CONSTRAINTS.maxWidth}`,
        );
      }),
    );
  });
});

// ###################################
// Testing components
// ###################################

@Component({
  selector: 'dt-basic-context-dialog',
  template: `
    <button
      *ngIf="customTrigger"
      dt-icon-button
      [dtContextDialogTrigger]="dialog"
      variant="secondary"
    >
      <dt-icon name="agent"></dt-icon>
    </button>
    <dt-context-dialog
      #dialog
      [aria-label]="ariaLabel"
      [ariaLabelClose]="ariaLabelClose"
      [tabIndex]="tabIndexOverride"
      [disabled]="disabled"
      [overlayPanelClass]="panelClass"
      dt-ui-test-id="context-dialog"
    >
      <p>Some cool content</p>
      <button #interactive>test</button>
    </dt-context-dialog>
  `,
})
class BasicContextDialog {
  tabIndexOverride: number;
  ariaLabel: string;
  ariaLabelClose: string;
  disabled: boolean;
  customTrigger = false;
  panelClass: string | string[] = 'someclass';

  @ViewChild(DtContextDialog) contextDialog: DtContextDialog;
  @ViewChild(DtContextDialogTrigger)
  contextDialogTrigger: DtContextDialogTrigger;
  @ViewChild('interactive') firstInteractive: ElementRef;
}
