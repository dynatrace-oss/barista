
import {ComponentFixture, TestBed, fakeAsync, inject} from '@angular/core/testing';
import { Component, ViewChild, ElementRef, TemplateRef, NgModule } from '@angular/core';
import { DtOverlayModule, DtOverlay } from '@dynatrace/angular-components';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { OverlayContainer } from '@angular/cdk/overlay';

fdescribe('DtOverlay', () => {
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
});

/** dummy component */
@Component({
  selector: 'dt-test-component',
  template: '<div #trigger>trigger</div><ng-template #overlay>overlay</ng-template>',
})
class TestComponent {
  @ViewChild('trigger') trigger: ElementRef;
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
