export const TEST_DATA = {
  autocomplete: [
    {
      name: 'AUT',
      autocomplete: [
        {
          name: 'Upper Austria',
          distinct: true,
          autocomplete: [
            {
              name: 'Cities',
              options: [
                'Linz',
                'Wels',
                'Steyr'
              ]
            }
          ]
        },
        {
          name: 'Wien'
        }
      ]
    },
    {
      name: 'USA',
      autocomplete: [
        {
          name: 'California',
          autocomplete: [
            'Los Angeles',
            'San Fran'
          ]
        }
      ]
    }
  ]
}
