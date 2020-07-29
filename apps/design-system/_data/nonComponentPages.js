const axios = require('axios');

// TOOD: `Pages` is the default data set for 11ty, we are not happy
// with the naming of this one, but went with it for now.
module.exports = async function () {
  const pagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/`,
  );
  const pagesData = pagesResponse.data.filter(
    (page) => page.category === null || page.category.title !== 'Components',
  );

  return pagesData;
};
