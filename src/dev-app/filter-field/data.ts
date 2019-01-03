export interface ComplexType { name: string; value: string; }
export type AutocompleteItemType = ItemType | ComplexType | string | GroupType;
export interface AutocompleteType extends ComplexType { autocomplete: AutocompleteItemType[]; }
export interface FreeTextType extends ComplexType { suggestions: AutocompleteItemType[]; }
export interface GroupType { name: string; group: AutocompleteItemType[]; }
export type ItemType = AutocompleteType | FreeTextType;

// tslint:disable:no-any
export function isAutocomplete(item: any | null): item is AutocompleteType {
  return !!item &&  (typeof item === 'object' && Array.isArray((item as AutocompleteType).autocomplete));
}

export function isFreeText(item: any | null): item is FreeTextType {
  return !!item &&  (typeof item === 'object' && Array.isArray((item as FreeTextType).suggestions));
}

export function isGroup(item: any | null): item is GroupType {
  return !!item &&  (typeof item === 'object' && Array.isArray((item as GroupType).group));
}
// tslint:enable:no-any

export function getViewValue(item: AutocompleteItemType): string {
  return typeof item === 'string' ? item : item.name;
}

export const FILTER_FIELD_EXAMPLE_DATA: AutocompleteType = {
  name: 'Category',
  value: 'category',
  autocomplete: [
    {
      name: 'Locations',
      group: [
        {
          name: 'State',
          value: 'state',
          autocomplete: [
            {
              name: 'Oberösterreich',
              value: 'OOE',
              autocomplete: ['Linz', 'Wels' , 'Steyr' , 'Leonding' , 'Traun' , 'Vöcklabruck'],
            },
            {
              name: 'Niederösterreich',
              value: 'NOE',
              autocomplete: ['St. Pölten', 'Melk', 'Krems', 'St. Valentin', 'Amstetten'],
            },
            {
              name: 'Wien',
              value: 'W',
            },
            {
              name: 'Burgenland',
              value: 'B',
            },
            {
              name: 'Steiermark',
              value: 'SMK',
            },
            {
              name: 'Kärnten',
              value: 'KTN',
            },
            {
              name: 'Tirol',
              value: 'TRL',
            },
            {
              name: 'Vorarlberg',
              value: 'VRB',
            },
            {
              name: 'Salzburg',
              value: 'SBZ',
            },
          ],
        },
        {
          name: 'Custom',
          value: 'custom-location',
          suggestions: [],
        },
      ],
    },
    {
      name: 'Browsers',
      group: [
        {
          name: 'Internet Explorer',
          value: 'IE',
          autocomplete: ['< 7', '7', '8', '9', '10', '11'],
        },
        {
          name: 'Edge',
          value: 'IE',
          autocomplete: ['12', '13', { name: 'Custom', value: 'custom-edge-version', suggestions: []}],
        },
        {
          name: 'Chrome',
          value: 'IE',
          autocomplete: ['Latest', { name: 'Custom', value: 'custom-chrome-version', suggestions: []}],
        },
      ],
    },
  ],
};
