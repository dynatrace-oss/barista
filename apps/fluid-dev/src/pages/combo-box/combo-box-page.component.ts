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
    'test11',
    'test12',
    'test13',
    'test14',
    'test15',
    'test16',
    'test17',
    'test18',
    'test19',
    'test20',
    'test21',
    'test22',
    'test23',
    'test24',
    'test25',
    'test26',
    'test27',
    'test28',
    'test29',
    'test30',
    'test31',
    'test32',
    'test33',
    'test34',
    'test35',
    'test36',
    'test37',
    'test38',
    'test39',
    'test40',
    'test41',
    'test42',
    'test43',
    'test44',
    'test45',
    'test46',
    'test47',
    'test48',
    'test49',
    'test50',
    'test51',
    'test52',
    'test53',
    'test54',
    'test55',
    'test56',
    'test57',
    'test58',
    'test59',
    'test60',
    'test61',
    'test62',
    'test63',
    'test64',
    'test65',
    'test66',
    'test67',
    'test68',
    'test69',
    'test70',
    'test71',
    'test72',
    'test73',
    'test74',
    'test75',
    'test76',
    'test77',
    'test78',
    'test79',
    'test80',
    'test81',
    'test82',
    'test83',
    'test84',
    'test85',
    'test86',
    'test87',
    'test88',
    'test89',
    'test90',
    'test91',
    'test92',
    'test93',
    'test94',
    'test95',
    'test96',
    'test97',
    'test98',
    'test99',
    'test100',
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
    // setTimeout(() => {
    //   for (let i = 0; i < 1000; i += 1) {
    //     this.optionsAplenty.push(`option${i}`);
    //   }
    //   this.optionsAplenty = [...this.optionsAplenty];
    //   this.disabled = false;
    //   this._comboBoxDisable.disabled = true;
    //   setTimeout(() => {
    //     this.disabled = true;
    //   }, 5000);
    // }, 5000);
  }

  optionTemplateFn(option: { count: number; text: string }): string {
    return `<option>${option.count % 2 === 0 ? `${option.count} ` : ''} ${
      option.text
    }</option>`;
  }
}
