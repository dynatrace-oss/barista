
import {ComponentFixture, TestBed, fakeAsync, inject, flush} from '@angular/core/testing';
import { Component, ViewChild, ElementRef, TemplateRef, NgModule } from '@angular/core';
import { DtOverlayModule, DtOverlay } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

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

  beforeEach(inject([DtOverlay, OverlayContainer], (overlay: DtOverlay, oc: OverlayContainer) => {
    dtOverlay = overlay;
    overlayContainer = oc;
    overlayContainerElement = oc.getContainerElement();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);

    fixture.detectChanges();

  });

  afterEach(() => {
    overlayContainer.ngOnDestroy();
  });

  it('should create a new overlay from templateRef', () => {
    dtOverlay.create(fixture.componentInstance.trigger, fixture.componentInstance.overlay);

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.innerText).toEqual('overlay');
  });

  it('should create a new overlay from component', () => {
    dtOverlay.create(fixture.componentInstance.trigger, DummyOverlay);

    fixture.detectChanges();

    const overlay = overlayContainerElement.querySelector('.dt-overlay-container') as HTMLElement;
    expect(overlay).toBeDefined();
    expect(overlay.innerText.trim()).toEqual('dummy-overlay');
  });

  it('should dismiss the overlay correctly', fakeAsync(() => {
    dtOverlay.create(fixture.componentInstance.trigger, fixture.componentInstance.overlay);
    fixture.detectChanges();

    let overlay = overlayContainerElement.querySelector('.dt-overlay-container');
    expect(overlay).toBeDefined();
    dtOverlay.dismiss();
    fixture.detectChanges();
    flush();
    overlay = overlayContainerElement.querySelector('.dt-overlay-container');
    expect(overlay).toBeNull();
  }));

  it('should not be pinnable by default', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(fixture.componentInstance.trigger, fixture.componentInstance.overlay);
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeFalsy();
  }));

  it('should be pinnable if config is passed', fakeAsync(() => {
    const dtOverlayRef = dtOverlay.create(fixture.componentInstance.trigger, fixture.componentInstance.overlay, { pinnable: true });
    fixture.detectChanges();
    dtOverlayRef.pin(true);
    fixture.detectChanges();
    flush();
    expect(dtOverlayRef.pinned).toBeTruthy();
  }));
});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: '<div #trigger>trigger</div><ng-template #overlay>overlay</ng-template>',
})
class TestComponent {
  @ViewChild('trigger') trigger: ElementRef;
  // tslint:disable-next-line:no-any
  @ViewChild('overlay') overlay: TemplateRef<any>;
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
