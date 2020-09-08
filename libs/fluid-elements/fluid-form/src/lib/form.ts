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

import {
  LitElement,
  html,
  query,
  customElement,
  TemplateResult,
} from 'lit-element';
import { FluidCheckbox } from '@dynatrace/fluid-elements/checkbox';
import { FluidSwitch } from '@dynatrace/fluid-elements/switch';
import { FluidFormSubmitEvent } from './form-events';

interface FormControl {
  tagName: string;
  serialize: (element: HTMLElement, formData: FormData) => void;
}

@customElement('fluid-form')
export class FluidForm extends LitElement {
  /**
   * Private member to hol the inner form element.
   * @private - An internal prop that should not appear in the readme and should
   */
  @query('form')
  private _form;

  /**
   * Static array to keep track of all the possible submitable form elements.
   * @private - An internal prop that should not appear in the readme and should
   */
  private static formControls: FormControl[] = [
    {
      tagName: 'fluid-checkbox',
      serialize: (element: FluidCheckbox, formData: FormData) => {
        if (element.name && !element.disabled && element.checked) {
          formData.append(element.name, element.value);
        }
      },
    },
    {
      tagName: 'fluid-switch',
      serialize: (element: FluidSwitch, formData: FormData) => {
        if (element.name && !element.disabled && element.checked) {
          formData.append(element.name, element.value);
        }
      },
    },
    {
      tagName: 'input',
      serialize: (element: HTMLInputElement, formData: FormData) => {
        if (
          (element.type === 'checkbox' || element.type === 'radio') &&
          !element.checked
        ) {
          return;
        }
        if (element.name && !element.disabled) {
          formData.append(element.name, element.value);
        }
      },
    },
    {
      tagName: 'select',
      serialize: (element: HTMLSelectElement, formData: FormData) => {
        if (element.name && !element.disabled) {
          formData.append(element.name, element.value);
        }
      },
    },
    {
      tagName: 'textarea',
      serialize: (element: HTMLSelectElement, formData: FormData) => {
        if (element.name && !element.disabled) {
          formData.append(element.name, element.value);
        }
      },
    },
  ];

  /**
   * Function to serialize all serializable elements in the form.
   */
  customSerialize(): FormData {
    let formData = new FormData();
    const tagList = FluidForm.formControls.map((control) => control.tagName);
    const slot = this._form.querySelector('slot');
    const slotted = slot
      .assignedElements({ flatten: true })
      // get all the elements in the slot, not just the immediate child elements
      .reduce(
        (all, element) =>
          all.concat(element, [...element.querySelectorAll('*')]),
        [],
      )
      // filter the elements based on what input elements we need
      .filter((element) =>
        tagList.includes(element.tagName.toLowerCase()),
      ) as Array<HTMLElement>;

    for (const element of slotted) {
      FluidForm.formControls
        .find((control) => control.tagName === element.tagName.toLowerCase())
        ?.serialize(element, formData);
    }

    return formData;
  }

  /**
   * Internal event handler to handle form submit.
   * @internal
   * @param e
   */
  _handleSubmit(e: Event): void {
    e.preventDefault();

    const formData: FormData = this.customSerialize();

    this._dispatchSubmitEvent(formData);
  }

  /**
   * Dispatches a submit event for the form
   */
  private _dispatchSubmitEvent(formData: FormData): void {
    this.dispatchEvent(new FluidFormSubmitEvent(formData));
  }

  /**
   * Render function of the custom element. It is called when one of the
   * observedProperties (annotated with @property) changes.
   */
  render(): TemplateResult {
    return html`
      <form @submit="${this._handleSubmit}">
        <slot></slot>
        <button type="submit">Submit button</button>
      </form>
    `;
  }
}
// TODO: Have a representation of the form state
// TODO: handle updated slot elements
// TODO: implement getFormData()
