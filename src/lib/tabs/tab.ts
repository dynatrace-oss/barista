import { Input, ElementRef, Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, TemplateRef, ContentChild, ViewContainerRef, ViewChild } from '@angular/core';
import { mixinColor, mixinDisabled, CanDisable, CanColor } from '@dynatrace/angular-components/core';
import { TemplatePortal } from '@angular/cdk/portal';
import { DtTabLabel } from './tab-label';

export type TabThemePalette = 'main' | 'error' | 'recovered' | undefined;
const defaultPalette: TabThemePalette = 'main';

// Boilerplate for applying mixins to DtTab.
export class DtTabBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtTabMixinBase = mixinDisabled(mixinColor(DtTabBase, defaultPalette));

@Component({
  moduleId: module.id,
  selector: 'a[dt-tab], dt-tab',
  exportAs: 'dtTab',
  templateUrl: 'tab.html',
  styleUrls: ['tab.scss'],
  inputs: ['disabled', 'color'],
  host: {
    class: 'dt-tab',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTab<T> extends _DtTabMixinBase implements OnInit, CanDisable, CanColor {

  /** Content for the tab label */
  @ContentChild(DtTabLabel) label: DtTabLabel;

  @ViewChild(TemplateRef) _contentRef: TemplateRef<any>;

  @Input()
  get value(): T { return this._value; }
  set value(val: T) { this._value = val; }

  private _value: T;

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  /** private only used in the tabgroup to get the content template portal */
  get _content(): TemplatePortal | null {
    return this._contentPortal;
  }

  /** indicates wether the tab is active */
  isActive = false;

  constructor(public elementRef: ElementRef, private _viewContainerRef: ViewContainerRef) {
    super(elementRef);
  }

  ngOnInit(): void {
    this._contentPortal = new TemplatePortal(this._contentRef, this._viewContainerRef);
  }
}
