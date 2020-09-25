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

import '@dynatrace/fluid-elements/button';
import '@dynatrace/fluid-elements/combo-box';

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
import { Component, ElementRef, ViewChild } from '@angular/core';

// tslint:disable-next-line: no-duplicate-imports
import { FluidComboBox } from '@dynatrace/fluid-elements/combo-box';

interface OptionObject {
  count: number;
  text: string;
}

@Component({
  selector: 'fluid-combo-box-page',
  templateUrl: 'combo-box-page.component.html',
  styleUrls: ['combo-box-page.component.scss'],
})
export class FluidComboBoxPage {
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
    { count: 11, text: `option11` },
    { count: 12, text: `option12` },
    { count: 13, text: `option13` },
    { count: 14, text: `option14` },
    { count: 15, text: `option15` },
    { count: 16, text: `option16` },
    { count: 17, text: `option17` },
    { count: 18, text: `option18` },
    { count: 19, text: `option19` },
    { count: 20, text: `option20` },
    { count: 21, text: `option21` },
    { count: 22, text: `option22` },
    { count: 23, text: `option23` },
    { count: 24, text: `option24` },
    { count: 25, text: `option25` },
    { count: 26, text: `option26` },
    { count: 27, text: `option27` },
    { count: 28, text: `option28` },
    { count: 29, text: `option29` },
    { count: 30, text: `option30` },
    { count: 31, text: `option31` },
    { count: 32, text: `option32` },
    { count: 33, text: `option33` },
    { count: 34, text: `option34` },
    { count: 35, text: `option35` },
    { count: 36, text: `option36` },
    { count: 37, text: `option37` },
    { count: 38, text: `option38` },
    { count: 39, text: `option39` },
    { count: 40, text: `option40` },
    { count: 41, text: `option41` },
    { count: 42, text: `option42` },
    { count: 43, text: `option43` },
    { count: 44, text: `option44` },
    { count: 45, text: `option45` },
    { count: 46, text: `option46` },
    { count: 47, text: `option47` },
    { count: 48, text: `option48` },
    { count: 49, text: `option49` },
    { count: 50, text: `option50` },
    { count: 51, text: `option51` },
    { count: 52, text: `option52` },
    { count: 53, text: `option53` },
    { count: 54, text: `option54` },
    { count: 55, text: `option55` },
    { count: 56, text: `option56` },
    { count: 57, text: `option57` },
    { count: 58, text: `option58` },
    { count: 59, text: `option59` },
    { count: 60, text: `option60` },
    { count: 61, text: `option61` },
    { count: 62, text: `option62` },
    { count: 63, text: `option63` },
    { count: 64, text: `option64` },
    { count: 65, text: `option65` },
    { count: 66, text: `option66` },
    { count: 67, text: `option67` },
    { count: 68, text: `option68` },
    { count: 69, text: `option69` },
    { count: 70, text: `option70` },
    { count: 71, text: `option71` },
    { count: 72, text: `option72` },
    { count: 73, text: `option73` },
    { count: 74, text: `option74` },
    { count: 75, text: `option75` },
    { count: 76, text: `option76` },
    { count: 77, text: `option77` },
    { count: 78, text: `option78` },
    { count: 79, text: `option79` },
    { count: 80, text: `option80` },
    { count: 81, text: `option81` },
    { count: 82, text: `option82` },
    { count: 83, text: `option83` },
    { count: 84, text: `option84` },
    { count: 85, text: `option85` },
    { count: 86, text: `option86` },
    { count: 87, text: `option87` },
    { count: 88, text: `option88` },
    { count: 89, text: `option89` },
    { count: 90, text: `option90` },
    { count: 91, text: `option91` },
    { count: 92, text: `option92` },
    { count: 93, text: `option93` },
    { count: 94, text: `option94` },
    { count: 95, text: `option95` },
    { count: 96, text: `option96` },
    { count: 97, text: `option97` },
    { count: 98, text: `option98` },
    { count: 99, text: `option99` },
    { count: 100, text: `option100` },
  ];

  optionsAplenty: string[] = [];

  @ViewChild('comboBox') _comboBox: ElementRef<FluidComboBox<string>>;

  @ViewChild('comboBoxCustomTemplate') _comboBoxCustomTemplate: ElementRef<
    FluidComboBox<any>
  >;

  setSelected1(): void {
    this._comboBox.nativeElement.selected = this.optionStrings.slice(2, 5);
  }

  getSelected1(): void {
    alert(this._comboBox.nativeElement.selected);
  }

  getValue1(): void {
    alert(this._comboBox.nativeElement.value);
  }

  setSelected2(): void {
    this._comboBoxCustomTemplate.nativeElement.selected = this.optionObjects.slice(
      2,
      5,
    );
  }

  getSelected2(): void {
    alert(JSON.stringify(this._comboBoxCustomTemplate.nativeElement.selected));
  }

  getValue2(): void {
    alert(this._comboBoxCustomTemplate.nativeElement.value);
  }

  optionTemplateFn(option: { text: string }): string {
    return `${option.text}`;
  }

  filterOptionsFn(options: OptionObject[], filter: string): OptionObject[] {
    return options.filter((option) => `${option.text}`.includes(filter));
  }

  displayNameFn(option: OptionObject): string {
    return option.text;
  }
}
