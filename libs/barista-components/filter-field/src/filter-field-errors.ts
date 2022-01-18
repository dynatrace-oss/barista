/**
 * @license
 * Copyright 2022 Dynatrace LLC
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

export function getDtFilterFieldRangeDuplicatedOperatorError(
  operatorType: string,
): Error {
  return Error(
    `An filter field range operator was already declared with 'type="${operatorType}"'.`,
  );
}

export function getDtFilterFieldRangeNoOperatorsError(): Error {
  return Error('There were no filter field range operators enabled.');
}

export function getDtFilterFieldApplyFilterNoRootDataProvidedError(): Error {
  return Error(
    'Filters can not be added because there is no data provided through the data source',
  );
}

export function getDtFilterFieldApplyFilterParseError(): Error {
  return Error(
    'Filters can not be added because they do not match the structure of the provided data in the data source.',
  );
}
