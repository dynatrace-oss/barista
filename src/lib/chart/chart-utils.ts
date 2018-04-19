import { DtChartOptions } from './chart';

export function mergeNestedGroup(
  options: DtChartOptions,
  defaultChartOptions: DtChartOptions,
  optionGroupName: string
): DtChartOptions {
  if (!options[optionGroupName]) {
    options[optionGroupName] = {};
  }

  if (defaultChartOptions[optionGroupName]) {
    for (const prop in defaultChartOptions[optionGroupName]) {
      if (defaultChartOptions[optionGroupName].hasOwnProperty(prop) && !options[optionGroupName].hasOwnProperty(prop)) {
        options[optionGroupName][prop] = defaultChartOptions[optionGroupName][prop];
      }
    }
  }

  return options;
}
