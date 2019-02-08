
export const COMPLEX_DATA = {
  name: 'Category',
  value: 'category',
  autocomplete: [
    {
      name: 'Locations',
      options: [
        {
          name: 'State',
          value: 'state',
          distinct: true,
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
      options: [
        {
          name: 'Internet Explorer',
          value: 'IE',
          autocomplete: ['< 7', '7', '8', '9', '10', '11'],
        },
        {
          name: 'Edge',
          value: 'IE',
          autocomplete: ['12', '13', { name: 'Custom', suggestions: []}],
        },
        {
          name: 'Chrome',
          value: 'IE',
          autocomplete: ['Latest', { name: 'Custom', suggestions: []}],
        },
      ],
    },
  ],
};
