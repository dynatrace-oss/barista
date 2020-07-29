const glob = require('glob');
const { promises } = require('fs');
const fs = promises;
const path = require('path');
const axios = require('axios');
const matter = require('gray-matter');

module.exports = async function () {
  const componentPagesResponse = await axios.get(
    `${process.env.STRAPI_ENDPOINT}/nextpages/?category.title=Components`,
  );
  const componentPagesData = componentPagesResponse.data;

  const readmeFiles = glob.sync('libs/fluid-elements/**/README.md');
  const components = [];
  for (const filePath of readmeFiles) {
    const fileContent = await fs.readFile(
      path.resolve(process.cwd(), filePath),
      { encoding: 'utf-8' },
    );
    const parsedContent = matter(fileContent);

    const linkedComponent = componentPagesData.find(
      (page) => page.id === parsedContent.data.strapiPageID,
    );
    if (linkedComponent) {
      linkedComponent.readmeContent = parsedContent.content;
    }
  }

  return componentPagesData;
};
