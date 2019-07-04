// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { dtOptionDef, dtGroupDef, dtFreeTextDef, dtAutocompleteDef } from '@dynatrace/angular-components/filter-field';

// Import locally because utils are not exported for the public
import {
  generateOptionId,
  DELIMITER,
  peekOptionId,
  findDefForSource,
  transformSourceToTagData,
  optionFilterTextPredicate,
  optionSelectedPredicate,
  optionOrGroupFilteredPredicate,
  createTagDataForFilterValues
} from './filter-field-util';
import { DtFilterValue } from './types';

describe('DtFilterField Util', () => {

  describe('generateOptionId', () => {
    it('should create a unique id for a simple option definition', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', null, null, null, null);
      expect(generateOptionId(optionDef)).toBe(`Option 1${DELIMITER}`);
    });
    it('should create a unique id for an option definition inside a group', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', null, null, null, null);
      const groupDef = dtGroupDef('Group', [optionDef], {}, null, null);
      optionDef.option!.parentGroup = groupDef;
      expect(generateOptionId(optionDef)).toBe(`Group${DELIMITER}Option 1${DELIMITER}`);
    });

    it('should create a unique id for a simple option definition with a provided prefix', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', null, null, null, null);
      expect(generateOptionId(optionDef, `Prefix${DELIMITER}`)).toBe(`Prefix${DELIMITER}Option 1${DELIMITER}`);
    });

    it('should create a unique id for an option definition inside a group with a provided prefix', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', null, null, null, null);
      const groupDef = dtGroupDef('Group', [optionDef], {}, null, null);
      optionDef.option!.parentGroup = groupDef;
      expect(generateOptionId(optionDef, `Prefix${DELIMITER}`))
        .toBe(`Prefix${DELIMITER}Group${DELIMITER}Option 1${DELIMITER}`);
    });
  });

  describe('peekOptionId', () => {
    it('should return the existing uid of an option definition', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', 'id1', null, null, null);
      expect(peekOptionId(optionDef)).toBe('id1');
    });

    it('should create and return an ui of an option definition if there is none', () => {
      const optionDef = dtOptionDef('Option 1', 'Option 1', null, null, null, null);
      expect(peekOptionId(optionDef)).toBe(`Option 1${DELIMITER}`);
      expect(optionDef.option!.uid).toBe(`Option 1${DELIMITER}`);
    });
  });

  describe('findDefForSourceObj', () => {
    it('should return null if the provided root definition is not of type autocomplete', () => {
      expect(findDefForSource({}, dtFreeTextDef([], {}, null))).toBe(null);
      expect(findDefForSource({}, dtOptionDef('', {}, null, null, null, null))).toBe(null);
      expect(findDefForSource({}, dtGroupDef('', [], {}, null, null))).toBe(null);
    });

    it('should find the corresponding option definition based on a basic source object in an autocomplete def', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const autocompleteDef = dtAutocompleteDef([optionDef], false, false, autocompleteSource, null);
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

        const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
        const groupDef = dtGroupDef('Group 1', [optionDef], groupSource, null, null);
        const autocompleteDef = dtAutocompleteDef([groupDef], false, false, autocompleteSource, null);
        optionDef.option!.parentAutocomplete = autocompleteDef;
        optionDef.option!.parentGroup = groupDef;
        groupDef.group!.parentAutocomplete = autocompleteDef;
        expect(findDefForSource(optionSource, autocompleteDef)).toBe(optionDef);
      });

    it('should find the corresponding option definition when the source is a string inside an autocomplete def', () => {
      const optionSource = 'Option 1';
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(optionSource, optionSource, null, null, null, null);
      const autocompleteDef = dtAutocompleteDef([optionDef], false, false, autocompleteSource, null);
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(findDefForSource(optionSource, autocompleteDef)).toBe(optionDef);
    });

    it('should return null if no corresponding option definition could be found', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];
      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const autocompleteDef = dtAutocompleteDef([optionDef], false, false, autocompleteSource, null);
      optionDef.option!.parentAutocomplete = autocompleteDef;
      expect(findDefForSource({}, autocompleteDef)).toBe(null);
    });

    // fit('should', () => {
    //   const rootSource = {
    //     autocomplete: [
    //       { name: 'AUT', autocomplete: [], async: true },
    //     ],
    //   };
    //   const asyncSource = {
    //     name: 'AUT',
    //     autocomplete: [
    //       { name: 'Linz' },
    //     ],
    //     async: true,
    //   };
    //   let autDef = dtOptionDef(rootSource.autocomplete[0].name, rootSource.autocomplete[0], null, null, null, null);
    //   autDef = dtAutocompleteDef([], false, rootSource.autocomplete[0].async, rootSource.autocomplete[0], autDef);
    //   const rootDef = dtAutocompleteDef([autDef], false, false, rootSource, null);
    //   autDef.option!.parentAutocomplete = rootDef;

    //   findDefForSourceObj()
    // });
  });

  describe('createTagDataForFilterValues', () => {
    it('should create a tag data object out of a single option', () => {
      const optionSource = { name: 'Option 1' };
      const autocompleteSource = [optionSource];

      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const autocompleteDef = dtAutocompleteDef([optionDef], false, false, autocompleteSource, null);
      optionDef.option!.parentAutocomplete = autocompleteDef;

      const values = [optionDef] as DtFilterValue[];
      const tagData = createTagDataForFilterValues(values);

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

      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const groupDef = dtGroupDef('Group 1', [optionDef], groupSource, null, null);
      const autocompleteDef = dtAutocompleteDef([groupDef], false, false, autocompleteSource, null);
      optionDef.option!.parentAutocomplete = autocompleteDef;
      optionDef.option!.parentGroup = groupDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;

      const values = [optionDef] as DtFilterValue[];
      const tagData = createTagDataForFilterValues(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe(null);
      expect(tagData!.value).toBe('Option 1');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag data object out of a list of nested options', () => {
      const innerOptionSource = 'Inner Option';
      const outerOptionSource = { name: 'Outer Option', autocomplete: [innerOptionSource] };
      const rootAutocompleteSource = { autocomplete: [outerOptionSource] };

      const innerOptionDef = dtOptionDef(innerOptionSource, innerOptionSource, null, null, null, null);
      const outerOptionDef = dtOptionDef(outerOptionSource.name, outerOptionSource, null, null, null, null);
      const outerOptionAutocompleteDef = dtAutocompleteDef([innerOptionDef], false, false, outerOptionSource, outerOptionDef);
      innerOptionDef.option!.parentAutocomplete = outerOptionAutocompleteDef;
      const rootAutocompleteDef = dtAutocompleteDef([outerOptionAutocompleteDef], false, false, rootAutocompleteSource, null);
      outerOptionAutocompleteDef.option!.parentAutocomplete = rootAutocompleteDef;

      const values = [outerOptionDef, innerOptionDef] as DtFilterValue[];
      const tagData = createTagDataForFilterValues(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe('Outer Option');
      expect(tagData!.value).toBe('Inner Option');
      expect(tagData!.separator).toBe(null);
      expect(tagData!.isFreeText).toBe(false);
      expect(tagData!.filterValues).toBe(values);
    });

    it('should create a tag object out of a single free text', () => {
      const values = ['Some Text'];
      const tagData = createTagDataForFilterValues(values);

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

      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const freeTextDef = dtFreeTextDef([], optionSource, optionDef);
      const autocompleteDef = dtAutocompleteDef([freeTextDef], false, false, autocompleteSource, null);
      freeTextDef.option!.parentAutocomplete = autocompleteDef;

      const values = [freeTextDef, 'Some Text'] as DtFilterValue[];
      const tagData = createTagDataForFilterValues(values);

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

      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      const freeTextDef = dtFreeTextDef([], optionSource, optionDef);
      const groupDef = dtGroupDef('Group 1', [freeTextDef], groupSource, null, null);
      const autocompleteDef = dtAutocompleteDef([groupDef], false, false, autocompleteSource, null);
      freeTextDef.option!.parentGroup = groupDef;
      freeTextDef.option!.parentAutocomplete = autocompleteDef;
      groupDef.group!.parentAutocomplete = autocompleteDef;

      const values = [optionDef, 'Some Text'] as DtFilterValue[];
      const tagData = createTagDataForFilterValues(values);

      expect(tagData).not.toBeNull();
      expect(tagData!.key).toBe('Option 1');
      expect(tagData!.value).toBe('Some Text');
      expect(tagData!.separator).toBe('~');
      expect(tagData!.isFreeText).toBe(true);
      expect(tagData!.filterValues).toBe(values);
    });

    // it(
    //   'should return null if a tag object can not be created because of ' +
    //   'resolving a definition based on a source obj is not possible',
    //   () => {
    //     const optionSource = { name: 'Option 1' };
    //     const autocompleteSource = [optionSource];

    //     const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
    //     const autocompleteDef = dtAutocompleteDef([optionDef], false, false, autocompleteSource, null);
    //     const sources = [{}];
    //     const tagData = transformSourceToTagData(sources, autocompleteDef);
    //     expect(tagData).toBe(null);
    //   });
  });

  describe('optionFilterTextPredicate', () => {
    it('should return true if the viewValue of the option starts the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      expect(optionFilterTextPredicate(optionDef, 'Opt')).toBe(true);
    });

    it('should return true if the viewValue of the option contains the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      expect(optionFilterTextPredicate(optionDef, 'ion 1')).toBe(true);
    });

    it('should return false if the viewValue of the option does not contain the filter text', () => {
      const optionSource = { name: 'Option 1' };
      const optionDef = dtOptionDef(optionSource.name, optionSource, null, null, null, null);
      expect(optionFilterTextPredicate(optionDef, 'ion 2')).toBe(false);
    });
  });

  describe('optionSelectedPredicate', () => {
    it('should return false if the uid of the option is contained in the list of selected ids when it is a leaf node', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(optionSource.name, optionSource, optionSource.uid, null, null, null);
      expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(false);
      expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(false);
    });

    it('should return true if the uid of the option is not contained in the list of selected ids when it is a leaf node', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set(['2']);
      const optionDef = dtOptionDef(optionSource.name, optionSource, optionSource.uid, null, null, null);
      expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(true);
      expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(true);
    });

    it(
      'should return true if the uid of the option is contained in the list of selected ids ' +
      'when it is not a leaf node and distinct is false',
      () => {
        const optionSource = { name: 'Option 1', uid: '1', autocomplete: [] };
        const selectedIds = new Set([optionSource.uid]);
        let optionDef = dtOptionDef(optionSource.name, optionSource, optionSource.uid, null, null, null);
        optionDef = dtAutocompleteDef([], false, false, optionSource, optionDef);
        expect(optionSelectedPredicate(optionDef, selectedIds, false)).toBe(true);
      });

    it(
      'should return false if the uid of the option is contained in the list of selected ids ' +
      'when it is not a leaf node and distinct is true',
      () => {
        const optionSource = { name: 'Option 1', uid: '1', autocomplete: [] };
        const selectedIds = new Set([optionSource.uid]);
        let optionDef = dtOptionDef(optionSource.name, optionSource, optionSource.uid, null, null, null);
        optionDef = dtAutocompleteDef([], false, false, optionSource, optionDef);
        expect(optionSelectedPredicate(optionDef, selectedIds, true)).toBe(false);
      });
  });

  describe('optionOrGroupFilteredPredicate', () => {
    it('should return false if all options of a group are selected', () => {
      const optionSource = { name: 'Option 1', uid: '1' };
      const selectedIds = new Set([optionSource.uid]);
      const optionDef = dtOptionDef(optionSource.name, optionSource, optionSource.uid, null, null, null);
      const groupDef = dtGroupDef('Group 1', [optionDef], {}, null, null);
      optionDef.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(false);
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(false);
    });

    it('should return true if there is at least one option of a group not selected and distinct is false', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(option1Source.name, option1Source, option1Source.uid, null, null, null);
      const option2Def = dtOptionDef(option2Source.name, option2Source, option2Source.uid, null, null, null);
      const selectedIds = new Set([option1Source.uid]);
      const groupDef = dtGroupDef('Group 1', [option1Def, option2Def], {}, null, null);
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(true);
    });

    it('should return false if one option in a list of multiple is selected when distinct is set to true', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(option1Source.name, option1Source, option1Source.uid, null, null, null);
      const option2Def = dtOptionDef(option2Source.name, option2Source, option2Source.uid, null, null, null);

      const selectedIds = new Set([option1Source.uid]);
      const groupDef = dtGroupDef('Group 1', [option1Def, option2Def], {}, null, null);
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(false);
    });

    it('should return true if the list of selected options is empty when distinct is set to true or false', () => {
      const option1Source = { name: 'Option 1', uid: '1' };
      const option2Source = { name: 'Option 2', uid: '2' };
      const option1Def = dtOptionDef(option1Source.name, option1Source, option1Source.uid, null, null, null);
      const option2Def = dtOptionDef(option2Source.name, option2Source, option2Source.uid, null, null, null);
      const selectedIds = new Set();
      const groupDef = dtGroupDef('Group 1', [option1Def, option2Def], {}, null, null);
      option1Def.option!.parentGroup = groupDef;
      option2Def.option!.parentGroup = groupDef;
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, true)).toBe(true);
      expect(optionOrGroupFilteredPredicate(groupDef, selectedIds, false)).toBe(true);
    });
  });
});
