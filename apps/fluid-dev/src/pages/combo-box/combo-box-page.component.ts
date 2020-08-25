/**
 * @license
 * Copyright 2020 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import '@dynatrace/fluid-elements/combo-box';

// tslint:disable-next-line: no-duplicate-imports
import { FluidComboBox } from '@dynatrace/fluid-elements/combo-box';
// import { SelectionModel } from '../../../../../libs/fluid-elements/combo-box/src/lib/SelectionModel';

@Component({
  selector: 'fluid-combo-box-page',
  templateUrl: 'combo-box-page.component.html',
  styleUrls: ['combo-box-page.component.scss'],
})
export class FluidComboBoxPage implements AfterViewInit {
  disabled = true;

  optionStrings = [
    'test1',
    'test2',
    'test3',
    'test4',
    'test5',
    'test6',
    'test7',
    'test8',
    'test9',
    'test10',
  ];

  optionObjects = [
    { count: 1, text: `option01` },
    { count: 2, text: `option02` },
    { count: 3, text: `option03` },
    { count: 4, text: `option04` },
    { count: 5, text: `option05` },
    { count: 6, text: `option06` },
    { count: 7, text: `option07` },
    { count: 8, text: `option08` },
    { count: 9, text: `option09` },
    { count: 10, text: `option10` },
  ];

  optionsAplenty: string[] = [];

  @ViewChild('comboBoxCustomTemplate') _comboBoxCustomTemplate: FluidComboBox;
  @ViewChild('comboBoxDisableAtRuntime') _comboBoxDisable: FluidComboBox;

  constructor() {
    // const selectionModel = new SelectionModel<string>();
    // selectionModel.select('test1', 'test2');
    // selectionModel.deselect('something');
    // console.log(selectionModel.selected);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      for (let i = 0; i < 1000; i += 1) {
        this.optionsAplenty.push(`option${i}`);
      }
      this.optionsAplenty = [...this.optionsAplenty];

      this.disabled = false;
      this._comboBoxDisable.disabled = true;
      setTimeout(() => {
        this.disabled = true;
      }, 5000);
    }, 5000);
  }

  optionTemplateFn(option: { count: number; text: string }): string {
    return `<option>${option.count % 2 === 0 ? `${option.count} ` : ''} ${
      option.text
    }</option>`;
  }
}
