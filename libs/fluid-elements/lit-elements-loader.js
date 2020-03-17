/**
 * A webpack loader for generating JavaScript styles
 * from a imported CSS/SCSS file for webcomponents
 * based on Polymers LitElement.
 */
module.exports = function litElementScssLoader(source) {
  return `
    ${generateImport()}
    ${generateExport(source)}
  `;
};

/**
 * Generates the import instruction for the needed
 * css compiler of LitElement.
 */
function generateImport() {
  return `import {css} from 'lit-element';`;
}

/**
 * Generates the adjusted export of css which
 * can be used inside a LitElement webcomponent
 * together with Constructable Stylesheets.
 * @param {*} source
 */
function generateExport(source) {
  const content = escapeBackslashes(source);
  return `export default css\`${content}\`;`;
}

/**
 * Replaces single backlashes with double backslahes
 * which is needed for UTF-8 mapping characters inside
 * a content property of an element.
 * @param {*} source
 */
function escapeBackslashes(source) {
  return source.replace(/\\/g, '\\\\');
}
