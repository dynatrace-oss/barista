const glob = require('glob');
const { promises } = require('fs');
const fs = promises;
const path = require('path');
const axios = require('axios');

module.exports = async function () {
  const readmeFiles = glob.sync('libs/fluid-elements/**/README.md');
  const components = [];

  for (const filePath of readmeFiles) {
    const fileContent = await fs.readFile(
      path.resolve(process.cwd(), filePath),
      { encoding: 'utf-8' },
    );
    const componentName = path.basename(path.dirname(filePath));
    const cmsPageResponse = await axios.get(
      `${process.env.STRAPI_ENDPOINT}/nextpages/?title_contains=${componentName}`,
      { json: true },
    );
    const cmsPage = cmsPageResponse.data[0];
    const cmsData = cmsPage
      ? {
          contributors: cmsPage.contributors,
          tags: cmsPage.tags,
        }
      : {};

    components.push({
      title: componentName,
      content: fileContent,
      ...cmsData,
    });
  }

  return components;
};
