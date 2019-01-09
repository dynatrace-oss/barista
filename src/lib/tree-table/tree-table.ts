import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, ElementRef, Attribute, IterableDiffers, Optional } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { DtTreeControl } from './tree-table-control';
import { Directionality } from '@angular/cdk/bidi';
import { mixinHasInteractiveRows, HasInteractiveRows } from '@dynatrace/angular-components/table';

export const _DtTreeTableMixinBase =
  mixinHasInteractiveRows<any>(CdkTable);

/** Dynatrace Tree Table component */
@Component({
  selector: 'dt-tree-table',
  templateUrl: 'tree-table.html',
  styleUrls: ['tree-table.scss'],
  host: {
    'class': 'dt-tree-table',
    '[class.dt-table-interactive-rows]': 'interactiveRows',
    'role': 'treegrid',
    '[attr.aria-label]': 'ariaLabel',
  },
  inputs: ['trackBy', 'interactiveRows'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtTreeTable<T> extends _DtTreeTableMixinBase implements HasInteractiveRows {
  /** The tree control that handles expanding/collapsing or rows */
  @Input() treeControl: DtTreeControl<T>;

  @Input('aria-label') ariaLabel: string;

  constructor(
    readonly _differs: IterableDiffers,
    readonly _changeDetectorRef: ChangeDetectorRef,
    readonly _elementRef: ElementRef,
    @Attribute('role') role: string,
    @Optional() protected readonly _dir: Directionality,
  ) {
    super(_differs, _changeDetectorRef, _elementRef, role, _dir);

    if (!role) {
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}
