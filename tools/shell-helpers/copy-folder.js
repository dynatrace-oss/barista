const {
  readdirSync,
  mkdirSync,
  lstatSync,
  copyFileSync,
  rmdirSync,
} = require('fs');
const { join } = require('path');
const { argv } = require('process');

/**
 * Copies the given folder recursively to the target path.
 * @param {string} from The folder to copy
 * @param {string} to The destination to copy the folder's contents to
 */
function copyFolder(from, to) {
  rmdirSync(to, { recursive: true });
  mkdirSync(to);
  for (const element of readdirSync(from)) {
    if (lstatSync(join(from, element)).isFile()) {
      copyFileSync(join(from, element), join(to, element));
    } else {
      copyFolder(join(from, element), join(to, element));
    }
  }
}

module.exports = { copyFolder };

if (!require.main && require.main.filename) {
  const [from, to] = argv.slice(2);
  copyFolder(from, to);
}
