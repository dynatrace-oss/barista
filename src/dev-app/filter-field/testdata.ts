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
          name: 'Miami',
        },
        {
          name: 'Los Angeles',
        },
        {
          name: 'custom',
          suggestions: [],
        },
      ],
    },
    {
      name: 'DE (async)',
      async: true,
      autocomplete: [],
    },
  ],
};

export const TEST_DATA_ASYNC = {
  name: 'DE (async)',
  autocomplete: [
    { name: 'Berlin' },
    { name: 'München' },
  ],
};
