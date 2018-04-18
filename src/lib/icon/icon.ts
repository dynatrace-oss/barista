import {
  Component,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  Input,
  Attribute,
  ElementRef,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { take } from 'rxjs/operators/take';
import { DtIconRegistry } from './icon-registry';
import { DtIconType } from './icon-types';

@Component({
  moduleId: module.id,
  selector: 'dt-icon',
  exportAs: 'dtIcon',
  template: '<ng-content></ng-content>',
  host: {
    role: 'img',
    class: 'gh-icon',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtIcon implements OnChanges {

  /** Name of the icon in the registry. */
  @Input() name: DtIconType;

  constructor(
    private _elementRef: ElementRef,
    private _iconRegistry: DtIconRegistry,
    @Attribute('aria-hidden') ariaHidden: string
  ) {
    // If the user has not explicitly set aria-hidden, mark the icon as hidden, as this is
    // the right thing to do for the majority of icon use-cases.
    if (!ariaHidden) {
      _elementRef.nativeElement.setAttribute('aria-hidden', 'true');
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.name) {
      if (this.name) {
        this._iconRegistry.getNamedSvgIcon(this.name).pipe(take(1)).subscribe(
          (svg) => this._setSvgElement(svg),
          // We do not break the app when an icon could not be loaded
          // so do only a console.log here
          // tslint:disable-next-line:no-console
          (err: Error) => console.log(`Error retrieving icon: ${err.message}`)
        );
      } else {
        this._clearSvgElement();
      }
    }
  }

  private _setSvgElement(svg: SVGElement): void {
    this._clearSvgElement();
    this._elementRef.nativeElement.appendChild(svg);
  }

  private _clearSvgElement(): void {
    const layoutElement: HTMLElement = this._elementRef.nativeElement;
    const childCount = layoutElement.childNodes.length;

    // Remove existing child nodes and add the new SVG element. Note that we can't
    // use innerHTML, because IE will throw if the element has a data binding.
    for (let i = 0; i < childCount; i++) {
      layoutElement.removeChild(layoutElement.childNodes[i]);
    }
  }
}
