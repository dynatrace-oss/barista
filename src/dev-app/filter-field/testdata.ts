export const TEST_DATA = {
  autocomplete: [
    {
      name: 'AUT',
      distinct: true,
      autocomplete: [
        {
          name: 'Vienna',
        },
        {
          name: 'Linz',
        },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'US',
      autocomplete: [
        {
          name: 'a',
        },
        {
          name: 'b',
        },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
  ],
};

// selectedIds
// AUT, AUT-Vienna, US, US-b
