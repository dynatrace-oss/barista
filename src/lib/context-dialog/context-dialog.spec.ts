// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { ESCAPE } from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  flush,
  inject,
  tick,
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import {
  DtContextDialog,
  DtContextDialogModule,
  DtContextDialogTrigger,
} from '@dynatrace/angular-components/context-dialog';
import { DtIconModule } from '@dynatrace/angular-components/icon';

import { createComponent } from '../../testing/create-component';
import { dispatchKeyboardEvent } from '../../testing/dispatch-events';

describe('DtContextDialog', () => {
  let overlayContainer: OverlayContainer;

  // tslint:disable-next-line:no-any
  function configureDtContextDialogTestingModule(declarations: any[]): void {
    TestBed.configureTestingModule({
      imports: [
        DtContextDialogModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({ svgIconLocation: `{{name}}.svg` }),
      ],
      declarations,
    }).compileComponents();

    inject([OverlayContainer], (oc: OverlayContainer) => {
      overlayContainer = oc;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(async(() => {
      configureDtContextDialogTestingModule([BasicContextDialog]);
    }));

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

        it('should support setting a custom aria-label for the close button', fakeAsync(() => {
          fixture.componentInstance.ariaLabelClose = 'Close context dialog';
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          tick();
          const contextDialogCloseTrigger = fixture.debugElement.query(
            By.css('.dt-context-dialog-close-trigger'),
          ).nativeElement;
          expect(contextDialogCloseTrigger.getAttribute('aria-label')).toEqual(
            'Close context dialog',
          );
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

        // tslint:disable-next-line: dt-no-focused-tests
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
  });
});

////////////////////////////////////////
// Testing components
////////////////////////////////////////

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
      [aria-label-close-button]="ariaLabelClose"
      [tabIndex]="tabIndexOverride"
      [disabled]="disabled"
      [overlayPanelClass]="panelClass"
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

  @ViewChild(DtContextDialog, { static: false }) contextDialog: DtContextDialog;
  @ViewChild(DtContextDialogTrigger, { static: false })
  contextDialogTrigger: DtContextDialogTrigger;
  @ViewChild('interactive', { static: false }) firstInteractive: ElementRef;
}
