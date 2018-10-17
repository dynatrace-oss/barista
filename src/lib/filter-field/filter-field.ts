import {
  Component,
  ViewEncapsulation,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';

@Component({
  moduleId: module.id,
  selector: 'dt-filter-field',
  exportAs: 'dtFilterField',
  templateUrl: 'filter-field.html',
  styleUrls: ['filter-field.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtFilterField {

  @ViewChild('input') _inputEl: ElementRef;

  get _inputValue(): string { return this._inputEl ? this._inputEl.nativeElement.value : ''; }

  _handleInputKeyUp(event: KeyboardEvent): void {
    const keyCode = event.keyCode;
    if (keyCode === ENTER) {
      event.preventDefault();
      console.log(this._inputValue);
    }
  }

  private _addTextOrOperationNode(text: string) {

  }
}
