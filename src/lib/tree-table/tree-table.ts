import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, ElementRef, Attribute, IterableDiffers, Optional } from '@angular/core';
import { CdkTable } from '@angular/cdk/table';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { Directionality } from '@angular/cdk/bidi';
import { mixinHasInteractiveRows, HasInteractiveRows } from '@dynatrace/angular-components/table';

// tslint:disable-next-line:no-any
export const _DtTreeTableMixinBase = mixinHasInteractiveRows<any>(CdkTable);

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

  /** The aria label for the tree-table */
  @Input('aria-label') ariaLabel: string;

  constructor(
    readonly _differs: IterableDiffers,
    readonly _changeDetectorRef: ChangeDetectorRef,
    readonly _elementRef: ElementRef,
    @Attribute('role') role: string
  ) {
    super(_differs, _changeDetectorRef, _elementRef, role);

    if (!role) {
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}
