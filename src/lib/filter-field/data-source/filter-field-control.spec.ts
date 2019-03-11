import { defDistinctPredicate, generateDtFilterFieldDistinctId } from './filter-field-control';
import { dtAutocompleteDef, dtOptionDef, dtGroupDef } from '../types';

// tslint:disable:no-magic-numbers

// ROOT
// - AUT (distinct)
// - - OÖ (distinct)
// - - - Städte
// - - - - Linz
// - - - - Wels
// - - - - Steyr
// - - Wien

const cities = dtGroupDef(
  'Cities', [
    dtOptionDef('Linz', 'Linz', null, null, null),
    dtOptionDef('Wels', 'Wels', null, null, null),
    dtOptionDef('Steyr', 'Steyr', null, null, null),
  ],
  {}, null, null);
let uA = dtAutocompleteDef([cities], true, {}, null);
uA = dtOptionDef('OÖ', {}, uA, null, null);

cities.group!.options.forEach((city) => {
  city.option!.parentGroup = cities;
  city.option!.parentAutocomplete = uA;
});

const wien = dtOptionDef('Wien', 'Wien', null, null, null);
let aut = dtAutocompleteDef([uA, wien], true, {}, null);
aut = dtOptionDef('AUT', {}, aut, null, null);
wien.option!.parentAutocomplete = aut;
uA.option!.parentAutocomplete = aut;

const root = dtAutocompleteDef([aut], false, {}, null);
aut.option!.parentAutocomplete = root;

aut.option!.distinctId = generateDtFilterFieldDistinctId(aut);
uA.option!.distinctId = generateDtFilterFieldDistinctId(uA, aut.option!.distinctId!);
cities.group!.options.forEach((city) => {
  city.option!.distinctId = generateDtFilterFieldDistinctId(city, uA.option!.distinctId!);
});
wien.option!.distinctId = generateDtFilterFieldDistinctId(wien, aut.option!.distinctId!);

describe('filterDistinctDefPredicate', () => {
  it('should return true for all levels when providing no distinct ids', () => {
    expect(defDistinctPredicate(cities.group!.options[0], new Set())).toBe(true);
    expect(defDistinctPredicate(cities, new Set())).toBe(true);
    expect(defDistinctPredicate(uA, new Set())).toBe(true);
    expect(defDistinctPredicate(wien, new Set())).toBe(true);
    expect(defDistinctPredicate(aut, new Set())).toBe(true);
    expect(defDistinctPredicate(root, new Set())).toBe(true);
  });

  it('should filter out leaf option (Linz) if its distinct id is listed in the set', () => {
    const distinctIds = new Set([cities.group!.options[0].option!.distinctId!]);
    expect(defDistinctPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities, distinctIds)).toBe(true);
    expect(defDistinctPredicate(uA, distinctIds)).toBe(true);
    expect(defDistinctPredicate(wien, distinctIds)).toBe(true);
    expect(defDistinctPredicate(aut, distinctIds)).toBe(true);
    expect(defDistinctPredicate(root, distinctIds)).toBe(true);
  });

  it('should filter out parent option (OÖ) and group (cities) if all children are removed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
    ]);
    expect(defDistinctPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities.group!.options[1], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities.group!.options[2], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities, distinctIds)).toBe(false);
    expect(defDistinctPredicate(uA, distinctIds)).toBe(false);
    expect(defDistinctPredicate(wien, distinctIds)).toBe(true);
    expect(defDistinctPredicate(aut, distinctIds)).toBe(true);
    expect(defDistinctPredicate(root, distinctIds)).toBe(true);
  });

  it('should NOT filter out parent options and groups if all children are removed and autocomplete distinct flag is false', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = false;
    expect(defDistinctPredicate(cities.group!.options[0], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities.group!.options[2], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities, distinctIds)).toBe(true);
    expect(defDistinctPredicate(uA, distinctIds)).toBe(true);
    expect(defDistinctPredicate(wien, distinctIds)).toBe(true);
    expect(defDistinctPredicate(aut, distinctIds)).toBe(true);
    expect(defDistinctPredicate(root, distinctIds)).toBe(true);
  });

  it('should filter out all parent options and groups if all children at all levels are remvoed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
      wien.option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = true;
    expect(defDistinctPredicate(cities.group!.options[0], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities.group!.options[1], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities.group!.options[2], distinctIds)).toBe(false);
    expect(defDistinctPredicate(cities, distinctIds)).toBe(false);
    expect(defDistinctPredicate(uA, distinctIds)).toBe(false);
    expect(defDistinctPredicate(wien, distinctIds)).toBe(false);
    expect(defDistinctPredicate(aut, distinctIds)).toBe(false);
    expect(defDistinctPredicate(root, distinctIds)).toBe(false);
  });

  it('should NOT filter out parent options and groups if only some children are removed', () => {
    const distinctIds = new Set([
      cities.group!.options[0].option!.distinctId!,
      cities.group!.options[1].option!.distinctId!,
      cities.group!.options[2].option!.distinctId!,
      wien.option!.distinctId!,
    ]);
    uA.autocomplete!.distinct = false;
    expect(defDistinctPredicate(cities.group!.options[0], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities.group!.options[1], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities.group!.options[2], distinctIds)).toBe(true);
    expect(defDistinctPredicate(cities, distinctIds)).toBe(true);
    expect(defDistinctPredicate(uA, distinctIds)).toBe(true);
    expect(defDistinctPredicate(wien, distinctIds)).toBe(false);
    expect(defDistinctPredicate(aut, distinctIds)).toBe(true);
    expect(defDistinctPredicate(root, distinctIds)).toBe(true);
  });
});
