const { options } = require('yargs');
const { readFileSync, writeFileSync, lstatSync, readdirSync } = require('fs');
const { join } = require('path');

const { srcs, out } = options({
  srcs: { type: 'array', default: [] },
  out: { type: 'string' },
}).argv;

async function main() {
  const resolvedFiles = srcs
    .map((source) => source.split(' ')) // Sources may include multiple files seperated by spaces
    .reduce((a, b) => a.concat(b), []) // Flatten array
    .map((fileOrDirectory) => {
      // Sources might include directories, add all files in this case
      if (
        typeof fileOrDirectory === 'string' &&
        lstatSync(fileOrDirectory).isDirectory()
      ) {
        return readdirSync(fileOrDirectory).map((fileName) =>
          join(fileOrDirectory, fileName),
        );
      } else {
        return fileOrDirectory;
      }
    })
    .reduce((a, b) => a.concat(b), []); // Flatten array

  const inlineStyles = resolvedFiles
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(file))
    .map((contents) => `<style>${contents}</style>\n`);
  const inlineScripts = resolvedFiles
    .filter((file) => file.endsWith('.js'))
    .map((file) => readFileSync(file))
    .map((contents) => `<script>${contents}</script>\n`);

  const html = `
<!DOCTYPE html>
<html>
  <head>
    ${inlineStyles}
    ${inlineScripts}
  </head>
  <body></body>
</html>
`;
  writeFileSync(out, html);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
