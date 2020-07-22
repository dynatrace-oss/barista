const axios = require('axios');

module.exports = async function () {
  const categories = new Set();

  const cmsPagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/`,
    { json: true },
  );

  for (const page of cmsPagesResponse.data) {
    if (page && page.category) {
      categories.add(page.category.title);
    }
  }

  return Array.from(categories);
};
