import { Component, ChangeDetectionStrategy, ViewEncapsulation, ElementRef } from '@angular/core';
import { CanColor, mixinColor, Constructor } from '@dynatrace/angular-components/core';

export type DtTableProblemThemePalette = 'error' | 'warning';

// Boilerplate for applying mixins to DtButton.
export class DtTableProblemBase {
  constructor(public _elementRef: ElementRef) { }
}
export const _DtTableProblemBase =
  mixinColor<Constructor<DtTableProblemBase>, DtTableProblemThemePalette>(DtTableProblemBase, 'error');

@Component({
  selector: 'dt-table-problem',
  templateUrl: './table-problem.html',
  styleUrls: ['./table-problem.scss'],
  inputs: ['color'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.Emulated,
})
export class DtTableProblem extends _DtTableProblemBase implements CanColor { }
