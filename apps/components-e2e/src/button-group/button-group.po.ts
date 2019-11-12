import { Selector } from 'testcafe';

export const groupItem = (item: number, group = 1) =>
  Selector(`#group-${group}-item-${item}`);

export const labelText = async (group = 1) =>
  Selector(`#lblGroup-${group}`).textContent;

export const isSelected = async (item: Selector) =>
  item.hasClass('dt-button-group-item-selected');

export const isDisabled = async (item: Selector) =>
  item.hasClass('dt-button-group-item-disabled');
