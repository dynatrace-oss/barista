import {
  async,
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  flush,
  flushMicrotasks,
  tick
} from '@angular/core/testing';
import {Component, ViewChild, ViewChildren, QueryList} from '@angular/core';
import {By} from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import {ENTER, SPACE, TAB} from '@angular/cdk/keycodes';
import {
  DtContextDialogModule,
  DtContextDialog,
} from '@dynatrace/angular-components';

describe('DtContextDialog', () => {
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;
  let platform: Platform;

  function configureDtContextDialogTestingModule(declarations: any[] | undefined): void {
    TestBed.configureTestingModule({
      imports: [
        DtContextDialogModule,
      ],
      declarations,
    }).compileComponents();

    inject([OverlayContainer, Platform], (oc: OverlayContainer, p: Platform) => {
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
      platform = p;
    })();
  }

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  describe('core', () => {
    beforeEach(async(() => {
      configureDtContextDialogTestingModule([
        BasicContextDialog,
      ]);
    }));
    describe('accessibility', () => {
      describe('for context-dialog', () => {
        let fixture: ComponentFixture<BasicContextDialog>;
        let contextDialog: HTMLElement;
        let openTrigger: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicContextDialog);
          fixture.detectChanges();
          contextDialog = fixture.debugElement.query(By.css('.gh-context-dialog')).nativeElement;
          openTrigger = fixture.debugElement
            .query(By.css('.gh-context-dialog-open-trigger')).nativeElement;
        }));

        it('should set the role of the overlay to dialog', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          flush();
          const contextMenuPanel = fixture.debugElement
            .query(By.css('.gh-context-dialog-panel')).nativeElement;
          expect(contextMenuPanel.getAttribute('role')).toEqual('dialog');
        }));

        it('should have the dark theme class on the panel', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          flush();
          const contextDialogPanel = fixture.debugElement
            .query(By.css('.gh-context-dialog-panel')).nativeElement;
          expect(contextDialogPanel.classList.contains('gh-theme-dark')).toEqual(true);
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(openTrigger.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should set the tabindex of the trigger to 0 by default', fakeAsync(() => {
          expect(openTrigger.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(openTrigger.getAttribute('tabindex')).toBe('3');
        }));

        it('should set the tab index on the host to -1', fakeAsync(() => {
          expect(contextDialog.getAttribute('tabindex')).toBe('-1');
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
          expect(openTrigger.getAttribute('tabindex')).toEqual('-1');
          fixture.componentInstance.disabled = false;
          fixture.detectChanges();
          expect(openTrigger.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to focus the context dialog', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          fixture.componentInstance.contextDialog.focus();

          expect(document.activeElement).toBe(
            contextDialog,
            'Expected context  Dialog element to be focused.'
          );
        }));
      });
    });
  });
});

////////////////////////////////////////
// Testing components
////////////////////////////////////////

@Component({
  selector: 'dt-basic-context-dialog',
  template: `
  <gh-context-dialog [aria-label]="ariaLabel" [tabIndex]="tabIndexOverride" [disabled]="disabled">
    <p>Some cool content</p>
  </gh-context-dialog>
  `,
})
class BasicContextDialog {
  tabIndexOverride: number;
  ariaLabel: string;
  disabled: boolean;
  editDisabled = false;

  @ViewChild(DtContextDialog) contextDialog: DtContextDialog;
}
