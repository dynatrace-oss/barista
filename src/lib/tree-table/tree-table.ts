import { Component, ViewEncapsulation, ChangeDetectionStrategy, Input, ChangeDetectorRef, ElementRef, Attribute, IterableDiffers, Optional, TrackByFunction, isDevMode } from '@angular/core';
import { DtTreeControl } from '@dynatrace/angular-components/core';
import { _DtTableBase } from '@dynatrace/angular-components/table';

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
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class DtTreeTable<T> extends _DtTableBase<T> {
  /** The tree control that handles expanding/collapsing or rows */
  @Input() treeControl: DtTreeControl<T>;
  /** The aria label for the tree-table */
  @Input('aria-label') ariaLabel: string;

  constructor(
    differs: IterableDiffers,
    changeDetectorRef: ChangeDetectorRef,
    elementRef: ElementRef,
    @Attribute('role') role: string
  ) {
    super(differs, changeDetectorRef, elementRef, role);
    if (!role) {
      // We need this setAttribute here to override the attribute set in the constructor of the cdkTable
      this._elementRef.nativeElement.setAttribute('role', 'treegrid');
    }
  }
}
