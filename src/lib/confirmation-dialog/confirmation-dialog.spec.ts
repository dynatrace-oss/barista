import {
  ComponentFixture,
  TestBed,
  inject,
  fakeAsync,
  tick,
  flush,
} from '@angular/core/testing';
import { OverlayContainer } from '@angular/cdk/overlay';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Component } from '@angular/core';
import { DT_CONFIRMATION_FADE_DURATION } from './confirmation-dialog-constants';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DtConfirmationDialogModule } from './confirmation-dialog-module';

describe('ConfirmationDialogComponent', () => {
  const UP = 'translateY(0)';
  const DOWN = 'translateY(100%)';

  let overlayContainerElement: HTMLElement;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, DtConfirmationDialogModule],
      providers: [],
      declarations: [TestComponent, DynamicStates, TwoDialogsComponent],
    }).compileComponents();
  }));

  beforeEach(inject(
    [OverlayContainer, BreakpointObserver],
    (oc: OverlayContainer) => {
      overlayContainerElement = oc.getContainerElement();
    },
  ));

  describe('core functionality', () => {
    let fixture: ComponentFixture<TestComponent>;
    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TestComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should pop up if state matches any child', fakeAsync(() => {
      const dialog = getDialog(overlayContainerElement);
      expect(dialog.style.transform).toEqual(UP);
    }));

    it('should not pop up if state does not match any child', fakeAsync(() => {
      fixture.componentInstance.testState = 'missingState';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const dialog = getDialog(overlayContainerElement);
      expect(dialog.style.transform).toEqual(DOWN);
    }));

    it('should display matched dt-confirmation-dialog-state', fakeAsync(() => {
      fixture.componentInstance.testState = 'state1';
      fixture.detectChanges();
      tick(DT_CONFIRMATION_FADE_DURATION);
      const activeState = getState(overlayContainerElement, 'state1');
      expect(activeState.textContent!.trim()).toEqual('state1');
    }));

    it('should not display unmatched dt-confirmation-dialog-state', fakeAsync(() => {
      fixture.componentInstance.testState = 'state2';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const inactiveState = getState(overlayContainerElement, 'state1');
      expect(inactiveState.textContent).toEqual('');
    }));

    it('should display backdrop if showBackdrop is true', fakeAsync(() => {
      fixture.componentInstance.showBackdrop = true;
      fixture.detectChanges();
      const backdrop = overlayContainerElement.querySelector(
        '.confirmation-dialog-backdrop',
      ) as HTMLElement;
      expect(backdrop.style.opacity).toEqual('0.6');
      expect(backdrop.style.pointerEvents).toEqual('auto');
    }));

    it('should not display backdrop if showBackdrop is false', fakeAsync(() => {
      fixture.componentInstance.showBackdrop = false;
      fixture.detectChanges();
      const backdrop = overlayContainerElement.querySelector(
        '.confirmation-dialog-backdrop',
      ) as HTMLElement;
      expect(backdrop.style.opacity).toEqual('0');
      expect(backdrop.style.pointerEvents).toEqual('none');
    }));

    it('should be dimissed with ngOnDestroy ', fakeAsync(() => {
      fixture.componentInstance.testState = 'state1';
      fixture.detectChanges();
      tick(DT_CONFIRMATION_FADE_DURATION);
      fixture.destroy();
      const dialog = getDialog(overlayContainerElement);
      expect(dialog).toBeNull();
      // Explicitly calling fixture.destroy() schedules a new task in zonejs, manually flush() or test fails due to remain events.
      flush();
    }));
  });

  describe('dynamic states', () => {
    let fixture: ComponentFixture<DynamicStates>;
    it('should be able to switch to dynamically added states', fakeAsync(() => {
      fixture = TestBed.createComponent(DynamicStates);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testTextContent(overlayContainerElement, 'static');
      fixture.componentInstance.changeToDynamic();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      testTextContent(overlayContainerElement, 'dynamic');
    }));

    it('should dismiss the dialog if the current active state is removed', fakeAsync(() => {
      fixture = TestBed.createComponent(DynamicStates);
      fixture.componentInstance.changeToDynamic();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      fixture.componentInstance.hasDynamic = false;
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();

      expect(
        (overlayContainerElement.querySelector(
          '.dt-confirmation-dialog-container',
        ) as HTMLElement).style.transform,
      ).toBe('translateY(100%)');
    }));
  });

  describe('multiple confirmation dialogs', () => {
    let fixture: ComponentFixture<TwoDialogsComponent>;
    beforeEach(fakeAsync(() => {
      fixture = TestBed.createComponent(TwoDialogsComponent);
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
    }));

    it('should dismiss first dialog if second becomes active', fakeAsync(() => {
      const dialogs = [].slice.apply(
        overlayContainerElement.querySelectorAll(
          '.dt-confirmation-dialog-container',
        ),
      );
      expect(dialogs[0].style.transform).toEqual(UP);
      expect(dialogs[1].style.transform).toEqual(DOWN);
      fixture.componentInstance.secondDialogState = 'state2';
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      tick();
      fixture.detectChanges();
      const dialog1State = getState(overlayContainerElement, 'state1');
      const dialog2State = getState(overlayContainerElement, 'state2');
      expect(dialog1State.textContent).toEqual('');
      expect(dialog2State.textContent!.trim()).toEqual('state2');
    }));
  });
});

function testTextContent(
  overlayContainerElement: HTMLElement,
  expected: string,
): void {
  const container = overlayContainerElement.querySelector(
    '.dt-confirmation-dialog-content',
  );
  if (container && container.textContent) {
    expect(container.textContent.trim()).toBe(expected);
  } else {
    throw new Error(
      "No element found for querySelector '.dt-confirmation-dialog-content' found",
    );
  }
}

function getDialog(oc: HTMLElement): HTMLElement {
  return oc.querySelector('.dt-confirmation-dialog-container') as HTMLElement;
}

function getState(oc: HTMLElement, name: string): HTMLElement {
  return oc.querySelector(
    `dt-confirmation-dialog-state[name="${name}"]`,
  ) as HTMLElement;
}

/** test component */
@Component({
  selector: 'dt-test-component',
  template: `
    <dt-confirmation-dialog [state]="testState" [showBackdrop]="showBackdrop">
      <dt-confirmation-dialog-state name="state1">
        state1
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state name="state2">
        state2
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
})
class TestComponent {
  testState: string | null = 'state1';
  showBackdrop: boolean;
}

/** test component */
@Component({
  selector: 'dt-test-component',
  template: `
    <dt-confirmation-dialog [state]="testState">
      <dt-confirmation-dialog-state name="state1">
        state1
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>

    <dt-confirmation-dialog [state]="secondDialogState">
      <dt-confirmation-dialog-state name="state2">
        state2
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
})
class TwoDialogsComponent {
  testState: string | null = 'state1';
  secondDialogState: string | null = null;
  showBackdrop: boolean;
}

/** test component */
@Component({
  selector: 'dt-test-component',
  template: `
    <dt-confirmation-dialog [state]="testState">
      <dt-confirmation-dialog-state name="static">
        static
        <dt-confirmation-dialog-actions></dt-confirmation-dialog-actions>
      </dt-confirmation-dialog-state>
      <dt-confirmation-dialog-state *ngIf="hasDynamic" name="dynamic">
        dynamic
      </dt-confirmation-dialog-state>
    </dt-confirmation-dialog>
  `,
})
class DynamicStates {
  testState: string | null = 'static';
  hasDynamic = false;

  changeToDynamic(): void {
    this.hasDynamic = true;
    this.testState = 'dynamic';
  }
}
