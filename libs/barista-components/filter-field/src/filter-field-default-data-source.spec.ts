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

import { DtFilterFieldDefaultDataSource } from './filter-field-default-data-source';
import {
  DtNodeDef,
  DtOptionDef,
  isDtAutocompleteDef,
  isDtFreeTextDef,
  isDtGroupDef,
  isDtMultiSelectDef,
  isDtOptionDef,
  isDtRangeDef,
} from './types';

describe('DtFilterFieldDefaultDataSource', () => {
  let dataSource: DtFilterFieldDefaultDataSource;
  beforeEach(() => {
    dataSource = new DtFilterFieldDefaultDataSource();
  });

  describe('transformAutocomplete', () => {
    it('should transform a data object into an autocomplete node', () => {
      const transformedNode = dataSource.transformAutocomplete({
        autocomplete: [{ name: 'test' }],
      });
      expect(isDtAutocompleteDef(transformedNode)).toBe(true);
    });
  });

  describe('transformMultiSelect', () => {
    it('should transform a data object into a multiselect node', () => {
      const transformedNode = dataSource.transformMultiSelect({
        multiOptions: [{ name: 'test' }],
      });
      expect(isDtMultiSelectDef(transformedNode)).toBe(true);
    });
  });

  describe('transformOption', () => {
    it('should transform a data object into an option node', () => {
      const transformedNode = dataSource.transformOption({ name: 'test' });
      expect(isDtOptionDef(transformedNode)).toBe(true);
    });

    it('should adopt the consumer id as its uid', () => {
      const transformedNode = dataSource.transformOption({
        name: 'test',
        id: 'test-id',
      }) as DtNodeDef & { option: DtOptionDef };
      expect(isDtOptionDef(transformedNode)).toBe(true);
      expect(transformedNode.option.uid).toBe('test-id');
    });
  });

  describe('transformGroup', () => {
    it('should transform a data object into a group node', () => {
      const transformedNode = dataSource.transformGroup({
        name: 'group-name',
        options: [{ name: 'test' }],
      });
      expect(isDtGroupDef(transformedNode)).toBe(true);
    });
  });

  describe('transformFreeText', () => {
    it('should transform a data object into a free-text node', () => {
      const transformedNode = dataSource.transformFreeText({
        suggestions: [],
        validators: [],
      });
      expect(isDtFreeTextDef(transformedNode)).toBe(true);
    });
  });

  describe('transformRange', () => {
    it('should transform a data object into a range node', () => {
      const transformedNode = dataSource.transformRange({
        range: { operators: { equal: true }, unit: 'ms' },
      });
      expect(isDtRangeDef(transformedNode)).toBe(true);
    });
  });

  describe('transformObject', () => {
    it('should detect a generic object as an autocomplete and transform to an autocomplete node', () => {
      const transformedNode = dataSource.transformAutocomplete({
        autocomplete: [{ name: 'test' }],
      });
      expect(isDtAutocompleteDef(transformedNode)).toBe(true);
    });

    it('should detect a generic object as a multiselect and transform to a multiselect node', () => {
      const transformedNode = dataSource.transformMultiSelect({
        multiOptions: [{ name: 'test' }],
      });
      expect(isDtMultiSelectDef(transformedNode)).toBe(true);
    });

    it('should detect a generic object as an option and transform to an option node', () => {
      const transformedNode = dataSource.transformOption({ name: 'test' });
      expect(isDtOptionDef(transformedNode)).toBe(true);
    });

    it('should detect a generic object as a group and transform to a group node', () => {
      const transformedNode = dataSource.transformGroup({
        name: 'group-name',
        options: [{ name: 'test' }],
      });
      expect(isDtGroupDef(transformedNode)).toBe(true);
    });

    it('should detect a generic object as a free-text and transform to a free-text node', () => {
      const transformedNode = dataSource.transformFreeText({
        suggestions: [],
        validators: [],
      });
      expect(isDtFreeTextDef(transformedNode)).toBe(true);
    });

    it('should detect a generic object as a range and transform to a range node', () => {
      const transformedNode = dataSource.transformRange({
        range: { operators: { equal: true }, unit: 'ms' },
      });
      expect(isDtRangeDef(transformedNode)).toBe(true);
    });
  });
});
