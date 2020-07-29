const axios = require('axios');

module.exports = async function () {
  const componentPagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/?category.title=Components`,
  );
  const componentPagesData = componentPagesResponse.data;

  const groups = [];
  for (const page of componentPagesData) {
    if (!groups.some((group) => group.title === page.group)) {
      groups.push({ title: page.group, items: [] });
    }
    const group = groups.find((group) => group.title === page.group);
    group.items.push({ title: page.title, link: page.slug });
  }
  return groups;
};
