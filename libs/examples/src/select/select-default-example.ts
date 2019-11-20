/**
 * @license
 * Copyright 2019 Dynatrace LLC
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

import { Component } from '@angular/core';

@Component({
  selector: 'component-barista-example',
  template: `
    <dt-select placeholder="Choose your coffee" aria-label="Choose your coffee">
      <dt-option value="ThePerfectPour">ThePerfectPour</dt-option>
      <dt-option value="Affogato">Affogato</dt-option>
      <dt-option value="Americano">Americano</dt-option>
      <dt-option value="Bicerin">Bicerin</dt-option>
      <dt-option value="Breve">Breve</dt-option>
      <dt-option value="Café Bombón">Café Bombón</dt-option>
      <dt-option value="Café au lait">Café au lait</dt-option>
      <dt-option value="Caffé Corretto">Caffé Corretto</dt-option>
      <dt-option value="Café Crema">Café Crema</dt-option>
      <dt-option value="Caffé Latte">Caffé Latte</dt-option>
      <dt-option value="Caffé macchiato">Caffé macchiato</dt-option>
      <dt-option value="Café mélange">Café mélange</dt-option>
      <dt-option value="Coffee milk">Coffee milk</dt-option>
      <dt-option value="Cafe mocha">Cafe mocha</dt-option>
      <dt-option value="Ca phe sua da">Ca phe sua da</dt-option>
      <dt-option value="Kopi susu">Kopi susu</dt-option>
      <dt-option value="Cappuccino ">Cappuccino</dt-option>
      <dt-option value="Cappuccino-cups">Cappuccino-cups</dt-option>
      <dt-option value="Cappuccino">Cappuccino</dt-option>
      <dt-option value="Carajillo">Carajillo</dt-option>
      <dt-option value="Cortado">Cortado</dt-option>
      <dt-option value="Cuban espresso">Cuban espresso</dt-option>
      <dt-option value="Espresso">Espresso</dt-option>
      <dt-option value="The Flat White">The Flat White</dt-option>
      <dt-option value="Frappuccino">Frappuccino</dt-option>
      <dt-option value="Galao">Galao</dt-option>
      <dt-option value="Greek frappé coffee">Greek frappé coffee</dt-option>
      <dt-option value="Iced Coffee">Iced Coffee</dt-option>
      <dt-option value="Indian filter coffee">Indian filter coffee</dt-option>
      <dt-option value="Instant coffee">Instant coffee</dt-option>
      <dt-option value="Irish coffee">Irish coffee</dt-option>
      <dt-option value="Kopi Luwak">Kopi Luwak</dt-option>
      <dt-option value="Kopi Tubruk">Kopi Tubruk</dt-option>
      <dt-option value="Turkish coffee">Turkish coffee</dt-option>
      <dt-option value="Vienna coffee">Vienna coffee</dt-option>
      <dt-option value="Yuanyang">Yuanyang</dt-option>
    </dt-select>
  `,
})
export class SelectDefaultExample {}
