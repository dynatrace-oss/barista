// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  inject,
  flush,
} from '@angular/core/testing';
import {
  Component,
  ViewChild,
  ElementRef,
  TemplateRef,
  NgModule,
} from '@angular/core';
import { DtOverlayModule, DtOverlay } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';
import {
  dispatchMouseEvent,
  dispatchKeyboardEvent,
} from '../../testing/dispatch-events';
import { ESCAPE } from '@angular/cdk/keycodes';
import { createComponent } from '../../testing/create-component';

describe('DtOverlay', () => {
  let dtOverlay: DtOverlay;
  let overlayContainer: OverlayContainer;
  let overlayContainerElement: HTMLElement;

  let fixture: ComponentFixture<TestComponent>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [DtOverlayModule, NoopAnimationsModule, TestOverlayModule],
      declarations: [TestComponent],
    }).compileComponents();
  }));

  beforeEach(inject(
    [DtOverlay, OverlayContainer],
    (overlay: DtOverlay, oc: OverlayContainer) => {
      dtOverlay = overlay;
      overlayContainer = oc;
      overlayContainerElement = oc.getContainerElement();
    },
  ));

  beforeEach(() => {
    fixture = createComponent(TestComponent);
  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create a new overlay from templateRef', () => {
    dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    ) as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.textContent).toContain('overlay');
  });

  it('should create a new overlay from component', () => {
    const ref = dtOverlay.create(
      fixture.componentInstance.trigger,
      DummyOverlay,
    );

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    ) as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.textContent).toContain('dummy-overlay');
    expect(ref.componentInstance).toBeInstanceOf(DummyOverlay);
  });

  it('should dismiss the overlay correctly', fakeAsync(() => {
    dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );
    fixture.detectChanges();

    let overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeDefined();
    dtOverlay.dismiss();
    fixture.detectChanges();
    flush();
    overlay = overlayContainerElement.querySelector('.dt-overlay-container');
    expect(overlay).toBeNull();
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
  }));

  it('should be pinnable if config is passed', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeTruthy();
  }));

  it('should close the overlay when pinned and backdrop is clicked', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    const backdrop = overlayContainerElement.querySelector(
      '.cdk-overlay-backdrop',
    );
    expect(backdrop).not.toBeNull();
    dispatchMouseEvent(backdrop!, 'click');
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeNull();
  }));

  it('should close the overlay when pinned and ESC is pressed', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(
      fixture.componentInstance.trigger,
      fixture.componentInstance.overlay,
      { pinnable: true },
    );
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
    const overlay = overlayContainerElement.querySelector(
      '.dt-overlay-container',
    );
    expect(overlay).toBeNull();
  }));
});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template:
    '<div #trigger>trigger</div><ng-template #overlay>overlay</ng-template>',
})
class TestComponent {
  @ViewChild('trigger', { static: true }) trigger: ElementRef;

  @ViewChild('overlay', { static: true }) overlay: TemplateRef<any>;
}

@Component({
  selector: 'dt-text-component-overlay',
  template: '<div class="dummy-overlay">dummy-overlay</div>',
})
class DummyOverlay {}

@NgModule({
  declarations: [DummyOverlay],
  entryComponents: [DummyOverlay],
})
export class TestOverlayModule {}
