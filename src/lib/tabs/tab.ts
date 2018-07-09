import { Input, ElementRef, Component, ViewEncapsulation, ChangeDetectionStrategy, OnInit, TemplateRef, ContentChild, ViewContainerRef, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { mixinColor, mixinDisabled } from '@dynatrace/angular-components/core';
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
  host: {
    class: 'dt-tab',
  },
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTab<T> extends _DtTabMixinBase implements OnInit, AfterViewInit, AfterContentInit {

  /** Content for the tab label */
  @ContentChild(DtTabLabel) label: DtTabLabel;

  private _value: T;

  @Input()
  get value(): T { return this._value; }
  set value(val: T) { this._value = val; }

  /** Portal that will be the hosted content of the tab */
  private _contentPortal: TemplatePortal | null = null;

  /** @docs-private */
  get content(): TemplatePortal | null {
    return this._contentPortal;
  }

  /** Template inside the DtTab view that contains an `<ng-content>`. */
  @ViewChild(TemplateRef) _content: TemplateRef<any>;

  constructor(public elementRef: ElementRef, private _viewContainerRef: ViewContainerRef) {
    super(elementRef);
  }

  ngOnInit(): void {
    console.log('onInit', this.content);
    this._contentPortal = new TemplatePortal(
        this._content, this._viewContainerRef);
  }

  ngAfterContentInit(): void {
    console.log('afterContentInit', this.label);
  }

  ngAfterViewInit(): void {
    console.log('Afterviewinit', this._content);
  }
}
