import { OverlayContainer } from '@angular/cdk/overlay';
import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, fakeAsync, inject, TestBed, tick, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DtContextDialog,
  DtContextDialogModule,
  DtContextDialogTrigger,
  DtIconModule,
} from '@dynatrace/angular-components';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('DtContextDialog', () => {
  let overlayContainer: OverlayContainer;

  // tslint:disable-next-line:no-any
  function configureDtContextDialogTestingModule(declarations: any[] | undefined): void {
    TestBed.configureTestingModule({
      imports: [
        DtContextDialogModule,
        HttpClientTestingModule,
        DtIconModule.forRoot({svgIconLocation: `{{name}}.svg`}),
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

  fdescribe('core', () => {
    beforeEach(async(() => {
      configureDtContextDialogTestingModule([
        BasicContextDialog,
      ]);
    }));
    describe('accessibility', () => {
      describe('for context-dialog', () => {
        let fixture: ComponentFixture<BasicContextDialog>;
        let contextDialog: HTMLElement;
        let contextDialogDefaultTrigger: HTMLElement;

        beforeEach(fakeAsync(() => {
          fixture = TestBed.createComponent(BasicContextDialog);
          fixture.detectChanges();
          contextDialog = fixture.debugElement.query(By.css('.dt-context-dialog')).nativeElement;
          contextDialogDefaultTrigger = fixture.debugElement
            .query(By.css('.dt-context-dialog-trigger')).nativeElement;
        }));

        it('should set the role of the overlay to dialog', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          tick();
          const contextMenuPanel = fixture.debugElement
            .query(By.css('.dt-context-dialog-panel')).nativeElement;
          expect(contextMenuPanel.getAttribute('role')).toEqual('dialog');
        }));

        it('should have the dark theme class on the panel', fakeAsync(() => {
          fixture.componentInstance.contextDialog.open();
          fixture.detectChanges();
          tick();
          const contextDialogPanel = fixture.debugElement
            .query(By.css('.dt-context-dialog-panel')).nativeElement;
          expect(contextDialogPanel.classList.contains('dt-theme-dark')).toEqual(true);
        }));

        it('should support setting a custom aria-label', fakeAsync(() => {
          fixture.componentInstance.ariaLabel = 'Custom Label';
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('aria-label')).toEqual('Custom Label');
        }));

        it('should set the tabindex of the trigger to 0 by default', fakeAsync(() => {
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to override the tabindex', fakeAsync(() => {
          fixture.componentInstance.tabIndexOverride = 3;
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toBe('3');
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
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual('-1');
          fixture.componentInstance.disabled = false;
          fixture.detectChanges();
          expect(contextDialogDefaultTrigger.getAttribute('tabindex')).toEqual('0');
        }));

        it('should be able to focus the context dialog default trigger', fakeAsync(() => {
          document.body.focus(); // ensure that focus isn't on the trigger already
          tick();
          fixture.componentInstance.contextDialog.focus();
          tick();

          expect(document.activeElement)
            .toBe(contextDialogDefaultTrigger, 'Expected context Dialog trigger to be focused.');
        }));

        it('should be able to show custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();

          const  contextDialogCustomTrigger = fixture.debugElement.query(By.directive(DtContextDialogTrigger));
          expect(contextDialogCustomTrigger)
            .toBeTruthy('Expected the DtContextDialogTrigger to display custom trigger button');
          expect(contextDialogDefaultTrigger.hidden)
            .toBeTruthy('Expected the DtContextDialogTrigger to hide default trigger button');
        }));

        it('should be able open context dialog by clicking custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();

          const  contextDialogCustomTrigger = fixture.debugElement.query(By.directive(DtContextDialogTrigger));
          contextDialogCustomTrigger.nativeElement.click();
          tick();
          expect(fixture.componentInstance.contextDialog.isPanelOpen)
            .toBeTruthy('Expected the custom trigger to open the context dialog');
        }));

        it('should be able to focus the context dialog custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();
          const  contextDialogCustomTrigger = fixture.debugElement.query(By.directive(DtContextDialogTrigger)).nativeElement;
          document.body.focus(); // ensure that focus isn't on the trigger already
          tick();
          fixture.componentInstance.contextDialog.focus();
          tick();

          expect(document.activeElement)
            .toBe(contextDialogCustomTrigger, 'Expected context Dialog custom trigger to be focused.');
        }));

        it('should be able to unregister a custom trigger', fakeAsync(() => {
          fixture.componentInstance.customTrigger = true;
          fixture.detectChanges();
          expect(fixture.componentInstance.contextDialog.trigger)
            .toBe(fixture.componentInstance.contextDialogTrigger, 'Expected context Dialog custom trigger to be assigned.');
          fixture.componentInstance.contextDialogTrigger._unregisterFromDialog();
          fixture.detectChanges();
          const contextDialogDefaultTriggerComponent = fixture.componentInstance.contextDialog._defaultTrigger;

          expect(contextDialogDefaultTrigger.hidden)
            .toBeFalsy('Expected to show default trigger button');
          expect(fixture.componentInstance.contextDialog.trigger)
            .toBe(contextDialogDefaultTriggerComponent, 'Expected context Dialog default trigger to be assigned.');
        }));
      });
    });
    describe('blur behaviour for context-dialog', () => {
      let fixture: ComponentFixture<BasicContextDialog>;

      beforeEach(fakeAsync(() => {
        fixture = TestBed.createComponent(BasicContextDialog);
        fixture.detectChanges();
      }));
      it('should close the context dialog on backrop click', fakeAsync(() => {
        const contextDialog = fixture.componentInstance.contextDialog;
        contextDialog.open();
        fixture.detectChanges();
        tick();
        const backdrop = overlayContainer.getContainerElement().querySelector('.cdk-overlay-backdrop');
        expect(backdrop).not.toBeNull();
        (backdrop! as HTMLElement).click();
        fixture.detectChanges();
        flush();
        expect(contextDialog.isPanelOpen).toBeFalsy();
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
    <button *ngIf="customTrigger" dt-icon-button [dtContextDialogTrigger]="dialog" variant="secondary">
      <dt-icon name="agent"></dt-icon>
    </button>
    <dt-context-dialog #dialog [aria-label]="ariaLabel" [tabIndex]="tabIndexOverride" [disabled]="disabled">
      <p>Some cool content</p>
    </dt-context-dialog>
  `,
})
class BasicContextDialog {
  tabIndexOverride: number;
  ariaLabel: string;
  disabled: boolean;
  customTrigger = false;

  @ViewChild(DtContextDialog) contextDialog: DtContextDialog;
  @ViewChild(DtContextDialogTrigger) contextDialogTrigger: DtContextDialogTrigger;
}
