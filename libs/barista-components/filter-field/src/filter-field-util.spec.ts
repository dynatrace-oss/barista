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

// eslint-disable  @angular-eslint/no-lifecycle-call, no-use-before-define, @typescript-eslint/no-use-before-define, no-magic-numbers, import/no-deprecated
// eslint-disable  @typescript-eslint/no-explicit-any, max-lines, @typescript-eslint/unbound-method, @angular-eslint/use-component-selector

import { Validators } from '@angular/forms';

// Import locally because utils are not exported for the public
import {
  defaultEditionDataForFilterValuesParser,
  defaultTagDataForFilterValuesParser,
  defDistinctPredicate,
  defUniquePredicate,
  DELIMITER,
  filterAutocompleteDef,
  filterGroupDef,
  filterOptionDef,
  findDefForSource,
  generateOptionId,
  isDtAutocompleteValueEqual,
  isDtRangeValueEqual,
  optionFilterTextPredicate,
  optionOrGroupFilteredPredicate,
  optionSelectedPredicate,
  peekOptionId,
} from './filter-field-util';
import {
  dtAutocompleteDef,
  DtAutocompleteValue,
  DtFilterValue,
  dtFreeTextDef,
  dtGroupDef,
  dtMultiSelectDef,
  DtNodeDef,
  DtNodeFlags,
  dtOptionDef,
  dtRangeDef,
  DtRangeValue,
  isDtFreeTextDef,
} from './types';

describe('DtFilterField Util', () => {
  describe('filterAutocompleteDef', () => {
    let optionDef: DtNodeDef;
    let optionDefInGroup: DtNodeDef;
    let groupDef: DtNodeDef;

    beforeEach(() => {
      optionDef = dtOptionDef('Option 1', null, 'Option 1', 'id1', null, null);
      optionDefInGroup = dtOptionDef(
        'Option 2',
        null,
        'Option 2',
        'id2',
        null,
        null,
      );
      groupDef = dtGroupDef(
        [optionDefInGroup],
        null,
        'Group 1',
        [optionDefInGroup],
        null,
      );
      optionDefInGroup.option!.parentGroup = groupDef;
    });

    it('should return a def if the provided autocomplete def contains at least one option after filtering', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDef],
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(), ''),
      ).not.toBeNull();
    });
    it('should return a def if the provided autocomplete def contains at least one group with options after filtering', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDefInGroup],
        null,
        [optionDefInGroup],
        false,
        false,
        false,
      );
      optionDefInGroup.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(), ''),
      ).not.toBeNull();
    });
    it('should return a def if the provided autocomplete def contains at least one option after all other options or groups are filtered out.', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDef, optionDefInGroup],
        null,
        [optionDef, optionDefInGroup],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      optionDefInGroup.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(['id2']), ''),
      ).not.toBeNull();
    });
    it('should return a def if the provided autocomplete def contains at least one group with options after all other options and groups are filtered out.', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDef, optionDefInGroup],
        null,
        [optionDef, optionDefInGroup],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      optionDefInGroup.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(['id1']), ''),
      ).not.toBeNull();
    });
    it('should return null if the provided autocomplete def contains no options after filtering', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDef],
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(['id1']), ''),
      ).toBeNull();
    });
    it('should return null if the provided autocomplete def contains no groups after filtering', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDefInGroup],
        null,
        [optionDefInGroup],
        false,
        false,
        false,
      );
      optionDefInGroup.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(['id2']), ''),
      ).toBeNull();
    });
    it('should return null if the provided autocomplete def contains no options and groups after filtering', () => {
      const autocompleteDef = dtAutocompleteDef(
        [optionDef, optionDefInGroup],
        null,
        [optionDef, optionDefInGroup],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      optionDefInGroup.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;
      expect(
        filterAutocompleteDef(autocompleteDef, new Set(['id1', 'id2']), ''),
      ).toBeNull();
    });
  });

  describe('filterGroupDef', () => {
    const optionDef = dtOptionDef(
      'Option 1',
      null,
      'Option 1',
      'id1',
      null,
      null,
    );
    const groupDef = dtGroupDef(
      [optionDef],
      null,
      'Group 1',
      [optionDef],
      null,
    );
    optionDef.option!.parentGroup = groupDef;

    it('should return a def if the provided group def contains at least one option after filtering', () => {
      expect(filterGroupDef(groupDef, new Set(), '')).not.toBeNull();
    });
    it('should return null if the provided group def contains no options after filtering', () => {
      expect(filterGroupDef(groupDef, new Set(['id1']), '')).toBeNull();
    });
  });

  describe('filterOptionDef', () => {
    const def = dtOptionDef('Option 1', null, 'Option 1', 'id1', null, null);
    it('should return a def if the provided option def is not removed via the selected-id and text filter', () => {
      expect(filterOptionDef(def, new Set(), '')).not.toBeNull();
    });
    it('should return null if the provided option def is removed via the selected-id filter but not the text filter', () => {
      expect(filterOptionDef(def, new Set(['id1']), '')).toBeNull();
    });
    it('should return null if the provided option def is removed via the text filter but not the selected-id filter', () => {
      expect(filterOptionDef(def, new Set([]), 'foo')).toBeNull();
    });
    it('should return null if the provided option def is removed via the text and the selected-id filter', () => {
      expect(filterOptionDef(def, new Set(['id1']), 'foo')).toBeNull();
    });
  });

  describe('generateOptionId', () => {
    it('should create a unique id for a simple option definition', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(generateOptionId(optionDef)).toBe(`Option 1${DELIMITER}`);
    });
    it('should create a unique id for an option definition inside a group', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      const groupDef = dtGroupDef({}, null, 'Group', [optionDef], null);
      optionDef.option!.parentGroup = groupDef;
      expect(generateOptionId(optionDef)).toBe(
        `Group${DELIMITER}Option 1${DELIMITER}`,
      );
    });

    it('should create a unique id for a simple option definition with a provided prefix', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(generateOptionId(optionDef, `Prefix${DELIMITER}`)).toBe(
        `Prefix${DELIMITER}Option 1${DELIMITER}`,
      );
    });

    it('should create a unique id for an option definition inside a group with a provided prefix', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      const groupDef = dtGroupDef({}, null, 'Group', [optionDef], null);
      optionDef.option!.parentGroup = groupDef;
      expect(generateOptionId(optionDef, `Prefix${DELIMITER}`)).toBe(
        `Prefix${DELIMITER}Group${DELIMITER}Option 1${DELIMITER}`,
      );
    });

    it('should return the prefix if prefixOnly is set to true', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(generateOptionId(optionDef, `Prefix${DELIMITER}`, true)).toBe(
        `Prefix${DELIMITER}`,
      );
    });
  });

  describe('peekOptionId', () => {
    it('should return the existing uid of an option definition', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        'id1',
        null,
        null,
      );
      expect(peekOptionId(optionDef)).toBe('id1');
    });

    it('should create and return an uid of an option definition if there is none', () => {
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(peekOptionId(optionDef)).toBe(`Option 1${DELIMITER}`);
      expect(optionDef.option!.uid).toBe(`Option 1${DELIMITER}`);
    });

    it('should create and return an uid of an option definition with an applied prefix', () => {
      const prefix = `Autocomplete${DELIMITER}`;
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(peekOptionId(optionDef, prefix)).toBe(
        `${prefix}Option 1${DELIMITER}`,
      );
      expect(optionDef.option!.uid).toBe(`${prefix}Option 1${DELIMITER}`);
    });

    it('should create and return an uid which is exactly the prefix of an option definition if prefixOnly is set to true', () => {
      const prefix = `Autocomplete${DELIMITER}`;
      const optionDef = dtOptionDef(
        'Option 1',
        null,
        'Option 1',
        null,
        null,
        null,
      );
      expect(peekOptionId(optionDef, prefix, true)).toBe(prefix);
      expect(optionDef.option!.uid).toBe(prefix);
    });
  });

  describe('findDefForSourceObj', () => {
    it('should return null if the provided root definition is not of type autocomplete', () => {
      expect(findDefForSource({}, dtFreeTextDef({}, null, [], [], false))).toBe(
        null,
      );
      expect(
        findDefForSource({}, dtOptionDef({}, null, '', null, null, null)),
      ).toBe(null);
      expect(findDefForSource({}, dtGroupDef({}, null, '', [], null))).toBe(
        null,
      );
    });

    it('should find the corresponding option definition based on a basic source object in an autocomplete def', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(findDefForSource(optionSource, autocompleteDef)).toBe(optionDef);
    });

    it(
      'should find the corresponding option definition based on a basic source object in an autocomplete def ' +
        'when wrapped inside a group',
      () => {
        const optionSource = { name: 'Option 1' };
        const groupSource = { options: [optionSource] };
        const autocompleteSource = [groupSource];

        const optionDef = dtOptionDef(
          optionSource,
          null,
          optionSource.name,
          null,
          null,
          null,
        );
        const groupDef = dtGroupDef(
          groupSource,
          null,
          'Group 1',
          [optionDef],
          null,
        );
        const autocompleteDef = dtAutocompleteDef(
          autocompleteSource,
          null,
          [groupDef],
          false,
          false,
          false,
        );
        optionDef.option!.parentAutocomplete = autocompleteDef;
        optionDef.option!.parentGroup = groupDef;
        groupDef.group!.parentAutocomplete = autocompleteDef;
        expect(findDefForSource(optionSource, autocompleteDef)).toBe(optionDef);
      },
    );

    it('should find the corresponding option definition when the source is a string inside an autocomplete def', () => {
      const optionSource = 'Option 1';
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource,
        null,
        null,
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(findDefForSource(optionSource, autocompleteDef)).toBe(optionDef);
    });

    it('should return null if no corresponding option definition could be found', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(findDefForSource({}, autocompleteDef)).toBe(null);
    });
  });

  describe('createTagDataForFilterValues', () => {
    it('should create a tag data object out of a single option', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];

      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [optionDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;

      const values = [optionDef] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(null);
      expect(tagData!.value).toBe('Option 1');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag data object out of a single option wrapped inside a group', () => {
      const optionSource = { name: 'Option 1' };
      const groupSource = { options: [optionSource] };
      const autocompleteSource = [groupSource];

      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const groupDef = dtGroupDef(
        groupSource,
        null,
        'Group 1',
        [optionDef],
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [groupDef],
        false,
        false,
        false,
      );
      optionDef.option!.parentAutocomplete = autocompleteDef;
      optionDef.option!.parentGroup = groupDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;

      const values = [optionDef] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(null);
      expect(tagData!.value).toBe('Option 1');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag data object out of a list of nested options', () => {
      const innerOptionSource = 'Inner Option';
      const outerOptionSource = {
        name: 'Outer Option',
        autocomplete: [innerOptionSource],
      };
      const rootAutocompleteSource = { autocomplete: [outerOptionSource] };

      const innerOptionDef = dtOptionDef(
        innerOptionSource,
        null,
        innerOptionSource,
        null,
        null,
        null,
      );
      const outerOptionDef = dtOptionDef(
        outerOptionSource,
        null,
        outerOptionSource.name,
        null,
        null,
        null,
      );
      const outerOptionAutocompleteDef = dtAutocompleteDef(
        outerOptionSource,
        outerOptionDef,
        [innerOptionDef],
        false,
        false,
        false,
      );
      innerOptionDef.option!.parentAutocomplete = outerOptionAutocompleteDef;
      const rootAutocompleteDef = dtAutocompleteDef(
        rootAutocompleteSource,
        null,
        [outerOptionAutocompleteDef],
        false,
        false,
        false,
      );
      outerOptionAutocompleteDef.option!.parentAutocomplete =
        rootAutocompleteDef;

      const values = [outerOptionDef, innerOptionDef] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe('Outer Option');
      expect(tagData!.value).toBe('Inner Option');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag object out of a single free text', () => {
      const values = ['Some Text'];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(null);
      expect(tagData!.value).toBe('Some Text');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(true);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag object out of a free-text as an option in an autocomplete', () => {
      const optionSource = { name: 'Option 1', suggestions: [] };
      const autocompleteSource = [optionSource];

      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], false);
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [freeTextDef],
        false,
        false,
        false,
      );
      freeTextDef.option!.parentAutocomplete = autocompleteDef;

      const values = [freeTextDef, 'Some Text'] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe('Option 1');
      expect(tagData!.value).toBe('Some Text');
      expect(tagData!.separator).toBe('~');
      expect(tagData!.isFreeText).toBe(true);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag object out of a free-text as an option wrapped in a group', () => {
      const optionSource = { name: 'Option 1', suggestions: [] };
      const groupSource = { options: [optionSource] };
      const autocompleteSource = [groupSource];

      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], false);
      const groupDef = dtGroupDef(
        groupSource,
        null,
        'Group 1',
        [freeTextDef],
        null,
      );
      const autocompleteDef = dtAutocompleteDef(
        autocompleteSource,
        null,
        [groupDef],
        false,
        false,
        false,
      );
      freeTextDef.option!.parentGroup = groupDef;
      freeTextDef.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;

      const values = [optionDef, 'Some Text'] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe('Option 1');
      expect(tagData!.value).toBe('Some Text');
      expect(tagData!.separator).toBe('~');
      expect(tagData!.isFreeText).toBe(true);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag data object out of multi select with one option', () => {
      const categSource = { name: 'Category' };
      const optionSource = { name: 'Option 1' };
      const groupSource = { options: [categSource] };
      const multiSelectSource = [groupSource];

      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      const multiSelectOptionDef = dtOptionDef(
        multiSelectSource,
        null,
        categSource.name,
        null,
        null,
        null,
      );
      const multiSelectDef = dtMultiSelectDef(
        null,
        multiSelectOptionDef,
        [optionDef],
        false,
      );
      optionDef.option!.parentAutocomplete = multiSelectDef;
      optionDef.option!.parentGroup = multiSelectDef;

      const values = [multiSelectDef, optionDef] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(categSource.name);
      expect(tagData!.value).toBe('Option 1');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag data object out of multi select with more than one option', () => {
      const categSource = { name: 'Category' };
      const option1Source = { name: 'Option 1' };
      const option2Source = { name: 'Option 2' };
      const groupSource = { options: [categSource] };
      const multiSelectSource = [groupSource];

      const option1Def = dtOptionDef(
        option1Source,
        null,
        option1Source.name,
        null,
        null,
        null,
      );
      const option2Def = dtOptionDef(
        option2Source,
        null,
        option2Source.name,
        null,
        null,
        null,
      );
      const multiSelectOptionDef = dtOptionDef(
        multiSelectSource,
        null,
        categSource.name,
        null,
        null,
        null,
      );
      const multiSelectDef = dtMultiSelectDef(
        null,
        multiSelectOptionDef,
        [option1Def, option2Def],
        false,
      );
      option1Def.option!.parentAutocomplete = multiSelectDef;
      option1Def.option!.parentGroup = multiSelectDef;
      option2Def.option!.parentAutocomplete = multiSelectDef;
      option2Def.option!.parentGroup = multiSelectDef;

      const values = [
        multiSelectDef,
        option1Def,
        option2Def,
      ] as DtFilterValue[];
      const tagData = defaultTagDataForFilterValuesParser(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(categSource.name);
      expect(tagData!.value).toBe('Option 1, Option 2');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });
  });

  describe('optionFilterTextPredicate', () => {
    it('should return true if the viewValue of the option starts the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      expect(optionFilterTextPredicate(optionDef, 'Opt')).toBe(true);
    });

    it('should return true if the viewValue of the option contains the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      expect(optionFilterTextPredicate(optionDef, 'ion 1')).toBe(true);
    });

    it('should return false if the viewValue of the option does not contain the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      );
      expect(optionFilterTextPredicate(optionDef, 'ion 2')).toBe(false);
    });
  });

  describe('optionSelectedPredicate', () => {
    it('should return false if the uid of the option is contained in the list of selected ids when it is a leaf node', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(
        false,
      );
      expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(false);
    });

    it('should return true if the uid of the option is not contained in the list of selected ids when it is a leaf node', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set(['2']);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(true);
      expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(true);
    });

    it(
      'should return true if the uid of the option is contained in the list of selected ids ' +
        'when it is not a leaf node and distinct is false',
      () => {
        const optionSource = { name: 'Option 1', uid: '1', autocomplete: [] };
        const selectedIds = new Set([optionSource.uid]);
        let optionDef = dtOptionDef(
          optionSource,
          null,
          optionSource.name,
          optionSource.uid,
          null,
          null,
        );
        optionDef = dtAutocompleteDef(
          optionSource,
          optionDef,
          [],
          false,
          false,
          false,
        ) as any;
        expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(
          true,
        );
      },
    );

    it(
      'should return false if the uid of the option is contained in the list of selected ids ' +
        'when it is not a leaf node and distinct is true',
      () => {
        const optionSource = { name: 'Option 1', uid: '1', autocomplete: [] };
        const selectedIds = new Set([optionSource.uid]);
        let optionDef = dtOptionDef(
          optionSource,
          null,
          optionSource.name,
          optionSource.uid,
          null,
          null,
        );
        optionDef = dtAutocompleteDef(
          optionSource,
          optionDef,
          [],
          false,
          false,
          false,
        ) as any;
        expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(
          false,
        );
      },
    );
  });

  describe('optionOrGroupFilteredPredicate', () => {
    it('should return false if all options of a group are selected', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const groupDef = dtGroupDef({}, null, 'Group 1', [optionDef], null);
      optionDef.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(
        false,
      );
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(
        false,
      );
    });

    it('should return true if there is at least one option of a group not selected and distinct is false', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(
        option1Source,
        null,
        option1Source.name,
        option1Source.uid,
        null,
        null,
      );
      const option2Def = dtOptionDef(
        option2Source,
        null,
        option2Source.name,
        option2Source.uid,
        null,
        null,
      );
      const selectedIds = new Set([option1Source.uid]);
      const groupDef = dtGroupDef(
        {},
        null,
        'Group 1',
        [option1Def, option2Def],
        null,
      );
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(
        true,
      );
    });

    it('should return false if one option in a list of multiple is selected when distinct is set to true', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(
        option1Source,
        null,
        option1Source.name,
        option1Source.uid,
        null,
        null,
      );
      const option2Def = dtOptionDef(
        option2Source,
        null,
        option2Source.name,
        option2Source.uid,
        null,
        null,
      );

      const selectedIds = new Set([option1Source.uid]);
      const groupDef = dtGroupDef(
        {},
        null,
        'Group 1',
        [option1Def, option2Def],
        null,
      );
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(
        false,
      );
    });

    it('should return true if the list of selected options is empty when distinct is set to true or false', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(
        option1Source,
        null,
        option1Source.name,
        option1Source.uid,
        null,
        null,
      );
      const option2Def = dtOptionDef(
        option2Source,
        null,
        option2Source.name,
        option2Source.uid,
        null,
        null,
      );
      const selectedIds = new Set<string>();
      const groupDef = dtGroupDef(
        {},
        null,
        'Group 1',
        [option1Def, option2Def],
        null,
      );
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(
        true,
      );
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(
        true,
      );
    });
  });

  describe('defDistinctPredicate', () => {
    it('should return true if an autocomplete is async and also an option; it is not selected and not distinct', () => {
      let def = dtAutocompleteDef({}, null, [], false, true, false);
      def = dtOptionDef({}, null, 'foo', 'id0', def, null) as any;
      const ids = new Set(['id1']);
      expect(defDistinctPredicate(def, ids, false)).toBe(true);
    });

    it('should return true if an autocomplete is async and also an option; it is selected but not distinct', () => {
      let def = dtAutocompleteDef({}, null, [], false, true, false);
      def = dtOptionDef({}, def, 'foo', 'id0', def, null) as any;
      const ids = new Set(['id0', 'id1']);
      expect(defDistinctPredicate(def, ids, false)).toBe(true);
    });

    it('should return false if an autocomplete is async and also an option; it is selected and distinct', () => {
      let def = dtAutocompleteDef({}, null, [], true, true, false);
      def = dtOptionDef({}, null, 'foo', 'id0', def, null) as any;
      const ids = new Set(['id0', 'id1']);
      expect(defDistinctPredicate(def, ids, false)).toBe(false);
    });
  });

  describe('dtFreeTextDef', () => {
    let optionSource;
    let optionDef;
    let validator;
    beforeEach(() => {
      optionSource = { name: 'Option 1', uid: '1' };
      optionDef = dtOptionDef(
        optionSource.name,
        optionSource,
        optionSource.uid,
        null,
        null,
        null,
      );
      validator = { validatorFn: Validators.required, error: 'is required' };
    });
    it('should create a dtFreeTextDef with the deprecated API without validators and unique and no existing def', () => {
      const freeTextDef = dtFreeTextDef(optionSource, null, [], [], false);
      expect(isDtFreeTextDef(freeTextDef)).toBeTruthy();
      expect(freeTextDef.freeText!.suggestions).toEqual([]);
      expect(freeTextDef.freeText!.unique).toBeFalsy();
      expect(freeTextDef.freeText!.validators).toEqual([]);
    });
    it('should create a dtFreeTextDef with the deprecated API without validators and unique', () => {
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], false);
      expect(isDtFreeTextDef(freeTextDef)).toBeTruthy();
      expect(freeTextDef.freeText!.suggestions).toEqual([]);
      expect(freeTextDef.freeText!.unique).toBeFalsy();
      expect(freeTextDef.freeText!.validators).toEqual([]);
    });
    it('should create a dtFreeTextDef with validators', () => {
      const freeTextDef = dtFreeTextDef(
        optionSource,
        optionDef,
        [],
        [validator],
        false,
      );
      expect(isDtFreeTextDef(freeTextDef)).toBeTruthy();
      expect(freeTextDef.freeText!.suggestions).toEqual([]);
      expect(freeTextDef.freeText!.unique).toBeFalsy();
      expect(freeTextDef.freeText!.validators).toEqual([validator]);
    });

    it('should create a dtFreeTextDef with validators', () => {
      const freeTextDef = dtFreeTextDef(
        optionSource,
        optionDef,
        [],
        [validator],
        true,
      );
      expect(isDtFreeTextDef(freeTextDef)).toBeTruthy();
      expect(freeTextDef.freeText!.suggestions).toEqual([]);
      expect(freeTextDef.freeText!.unique).toBeTruthy();
      expect(freeTextDef.freeText!.validators).toEqual([validator]);
    });
  });

  describe('defUniquePredicate', () => {
    it('should return false if the unique freetext is already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], true);
      expect(defUniquePredicate(freeTextDef, selectedIds)).toBe(false);
    });

    it('should return true if the unique freetext is not already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set<string>();
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], true);
      expect(defUniquePredicate(freeTextDef, selectedIds)).toBe(true);
    });

    it('should return true if the freetext is not unique but already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const freeTextDef = dtFreeTextDef(optionSource, optionDef, [], [], false);
      expect(defUniquePredicate(freeTextDef, selectedIds)).toBe(true);
    });

    it('should return false if the unique range is already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const rangeDef = dtRangeDef(
        optionSource,
        optionDef,
        true,
        true,
        true,
        true,
        's',
        true,
      );
      expect(defUniquePredicate(rangeDef, selectedIds)).toBe(false);
    });

    it('should return false if the unique multiSelect is already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const multiSelectDef = dtMultiSelectDef(
        optionSource,
        optionDef,
        [],
        true,
      );
      expect(defUniquePredicate(multiSelectDef, selectedIds)).toBe(false);
    });

    it('should return true if the unique freetext is not already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set<string>();
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const rangeDef = dtRangeDef(
        optionSource,
        optionDef,
        true,
        true,
        true,
        true,
        's',
        true,
      );
      expect(defUniquePredicate(rangeDef, selectedIds)).toBe(true);
    });

    it('should return true if the range is not unique but already in the selectedIds', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const rangeDef = dtRangeDef(
        optionSource,
        optionDef,
        true,
        true,
        true,
        true,
        's',
        false,
      );
      expect(defUniquePredicate(rangeDef, selectedIds)).toBe(true);
    });

    it('should return false if multiSelect', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        optionSource.uid,
        null,
        null,
      );
      const multiSelectDef = dtMultiSelectDef(
        optionSource,
        optionDef,
        [],
        true,
      );
      expect(defUniquePredicate(multiSelectDef, selectedIds)).toBe(false);
    });
  });

  describe('isDtRangeValueEqual', () => {
    it('should return true if range values are equal', () => {
      const test: DtRangeValue = { operator: '=', range: 1 };
      expect(isDtRangeValueEqual(test, test)).toBeTruthy();

      const test1: DtRangeValue = { operator: 'range', range: [1, 2] };
      expect(isDtRangeValueEqual(test1, test1)).toBeTruthy();

      const test2: DtRangeValue = {
        operator: 'range',
        range: [1, 2],
        unit: 's',
      };
      expect(isDtRangeValueEqual(test2, test2)).toBeTruthy();
    });
    it('should return true if range values have different array instances but the same values within', () => {
      const a: DtRangeValue = { operator: 'range', range: [1, 2] };
      const b: DtRangeValue = { operator: 'range', range: [1, 2] };
      expect(isDtRangeValueEqual(a, b)).toBeTruthy();
    });
    it('should return false when a has unit set but b does not', () => {
      const a: DtRangeValue = { operator: 'range', range: [1, 2] };
      const b: DtRangeValue = { operator: 'range', range: [1, 2], unit: 's' };
      expect(isDtRangeValueEqual(a, b)).toBeFalsy();
    });
    it('should return false when a has different numbers in the range array than b', () => {
      const a: DtRangeValue = { operator: 'range', range: [1, 2] };
      const b: DtRangeValue = { operator: 'range', range: [2, 3] };
      expect(isDtRangeValueEqual(a, b)).toBeFalsy();
    });
    it('should return false when a has the range numbers ordered differently than than b', () => {
      const a: DtRangeValue = { operator: 'range', range: [1, 2] };
      const b: DtRangeValue = { operator: 'range', range: [2, 1] };
      expect(isDtRangeValueEqual(a, b)).toBeFalsy();
    });
    it('should return false when a has the range array and b has a number', () => {
      const a: DtRangeValue = { operator: 'range', range: [1, 2] };
      const b: DtRangeValue = { operator: 'range', range: 1 };
      expect(isDtRangeValueEqual(a, b)).toBeFalsy();
    });
  });

  describe('isDtAutocompleteValueEqual', () => {
    it('should return true if both are options and both have the same uid without initial uid', () => {
      const optionSource = { name: 'Option 1' };
      const a = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      const b = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      expect(isDtAutocompleteValueEqual(a, b)).toBeTruthy();
      expect(isDtAutocompleteValueEqual(b, a)).toBeTruthy();
    });
    it('should return true if both are options and both have the same uid with a already having a uid', () => {
      const optionSource = { name: 'Option 1' };
      const a = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        `${optionSource.name}${DELIMITER}`,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      const b = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      expect(isDtAutocompleteValueEqual(a, b)).toBeTruthy();
      expect(isDtAutocompleteValueEqual(b, a)).toBeTruthy();
    });

    it('should return true if both are options and both have the same uid with a already having a uid and a prefix', () => {
      const prefix = `US${DELIMITER}`;
      const optionSource = { name: 'Option 1' };
      const a = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        `${prefix}${optionSource.name}${DELIMITER}`,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      const b = dtOptionDef(
        optionSource,
        null,
        optionSource.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      expect(isDtAutocompleteValueEqual(a, b, prefix)).toBeTruthy();
      expect(isDtAutocompleteValueEqual(b, a, prefix)).toBeTruthy();
    });

    it('should return false if options dont match with the uid', () => {
      const optionSourceA = { name: 'Option 1' };
      const a = dtOptionDef(
        optionSourceA,
        null,
        optionSourceA.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      const optionSourceB = { name: 'Option 2' };
      const b = dtOptionDef(
        optionSourceB,
        null,
        optionSourceB.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      expect(isDtAutocompleteValueEqual(a, b)).toBeFalsy();
      expect(isDtAutocompleteValueEqual(b, a)).toBeFalsy();
    });
    it('should return false if options dont match with the uid already set', () => {
      const optionSourceA = { name: 'Option 1' };
      const a = dtOptionDef(
        optionSourceA,
        null,
        optionSourceA.name,
        null,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      const optionSourceB = { name: 'Option 2' };
      const b = dtOptionDef(
        optionSourceB,
        null,
        optionSourceB.name,
        `${optionSourceB.name}${DELIMITER}`,
        null,
        null,
      ) as DtAutocompleteValue<any>;
      expect(isDtAutocompleteValueEqual(a, b)).toBeFalsy();
      expect(isDtAutocompleteValueEqual(b, a)).toBeFalsy();
    });
  });

  describe('defaultEditionDataForFilterValuesParser', () => {
    it('should return an empty string when filterValues is not defined', () => {
      // given
      const filterValues: DtFilterValue[] =
        undefined as unknown as DtFilterValue[];
      // when
      const result = defaultEditionDataForFilterValuesParser(filterValues);
      // then
      expect(result).toEqual('');
    });
    it('should return an empty string when filterValues is an empty array', () => {
      // given
      const filterValues: DtFilterValue[] = [];
      // when
      const result = defaultEditionDataForFilterValuesParser(filterValues);
      // then
      expect(result).toEqual('');
    });
    it('should return an empty string when filterValues is not a dtNodeDef', () => {
      // given
      const filterValues: DtFilterValue[] = [{}] as DtFilterValue[];
      // when
      const result = defaultEditionDataForFilterValuesParser(filterValues);
      // then
      expect(result).toEqual('');
    });

    it.each([
      DtNodeFlags.None,
      DtNodeFlags.RenderTypes,
      DtNodeFlags.TypeAutocomplete,
      DtNodeFlags.TypeFreeText,
      DtNodeFlags.TypeMultiSelect,
      DtNodeFlags.TypeRange,
    ])(
      'should return an empty string when filterValues nodeFlags are different than typeOption',
      (nodeFlags: DtNodeFlags) => {
        // given
        const filterValues: DtFilterValue[] = [
          { nodeFlags, option: { viewValue: 'test it' } },
        ] as DtFilterValue[];
        // when
        const result = defaultEditionDataForFilterValuesParser(filterValues);
        // then
        expect(result).toEqual('');
      },
    );

    it('should return the value when filterValues is a correct option', () => {
      // given
      const filterValues: DtFilterValue[] = [
        { nodeFlags: DtNodeFlags.TypeOption, option: { viewValue: 'test it' } },
      ] as DtFilterValue[];
      // when
      const result = defaultEditionDataForFilterValuesParser(filterValues);
      // then
      expect(result).toEqual('test it');
    });
    it('should return the first value when filterValues has multiple filterValues', () => {
      // given
      const filterValues: DtFilterValue[] = [
        { nodeFlags: DtNodeFlags.TypeOption, option: { viewValue: 'test it' } },
        {
          nodeFlags: DtNodeFlags.TypeOption,
          option: { viewValue: 'test it 2' },
        },
        {
          nodeFlags: DtNodeFlags.TypeOption,
          option: { viewValue: 'test it 3' },
        },
      ] as DtFilterValue[];
      // when
      const result = defaultEditionDataForFilterValuesParser(filterValues);
      // then
      expect(result).toEqual('test it');
    });
  });
});
