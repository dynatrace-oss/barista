// This script will be executed on npm postinstall and is a
// migration script for the phase where we support building with bazel
// and without.
const { exec } = require('child_process');
const { resolve } = require('path');
const { sync } = require('glob');
const { writeFileSync, readFileSync } = require('fs');

const MAIN_FIELD_NAME = 'main';
const NGCC_MAIN_FIELD_NAME = 'main_ivy_ngcc';
const NGCC_BINARY = resolve(
  './node_modules/@angular/compiler-cli/ngcc/main-ngcc.js',
);
const NGC_BINARY = resolve('./node_modules/@angular/compiler-cli/src/main.js');

async function main() {
  // Applying all the patches to the packages
  await execCommand(`node ${require.resolve('patch-package')}`);
  // when running with bazel we need to perform a ngcc to compile
  // all dependencies for ivy. If we are not run by bazel just build
  // the workspace library. With bazel this is already in the build cache.

  // Generate Angular ngfactory.js, ngsummary.js files for the dependencies,
  // that are needed for ViewEngine
  await execCommand(`node ${NGC_BINARY} -p view-engine-tsconfig.json`);
  // Generate Ivy entry points
  await execCommand(
    `node ${NGCC_BINARY} --properties es2015 browser module main --first-only --create-ivy-entry-points`,
  );
  // link the ivy entry points
  updateNgccMainFields();

  if (!process.env.BAZEL_NPM_INSTALL) {
    await execCommand(`npm run ng build workspace`);
  }
}

/**
 * Executes a shell command and return it as a Promise.
 * @param cmd {string}
 * @return {Promise<string>}
 */
function execCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      const output = stdout ? stdout : stderr;
      console.log(output);
      resolve(output);
    });
  });
}

/**
 * Script that runs after node modules have been installed, and Ngcc processed all packages.
 * This script updates the `package.json` files of Angular framework packages to point to the
 * Ngcc processed UMD bundles. This is needed because we run Angular in a `nodejs_binary`, but
 * want to make sure that Ivy is being used. By default, the NodeJS module resolution will load
 * the unprocessed UMD bundle because the `main` field of the `package.json` files point to the
 * View Engine UMD bundles. This script updates the `main` field in `package.json` files to point
 * to the previously generated Ivy UMD bundles.
 *
 * Ngcc does not by edit the `main` field because we ran it with the `--create-ivy-entry-points`
 * flag. It instructs Ngcc to not modify existing package bundles, but rather create separate
 * copies with the needed Ivy modifications. This is necessary because the original bundles
 * are needed for View Engine, and we want to preserve them in order to be able to switch
 * between Ivy and View Engine (for testing). Since the goal of this flag is to not modify
 * any original package files/bundles, Ngcc will not edit the `main` field to point to
 * the processed Ivy bundles.
 */
function updateNgccMainFields() {
  sync('node_modules/@angular/**/package.json').forEach((filePath) => {
    // Do not update `package.json` files for deeply nested node modules (e.g. dependencies of
    // the `@angular/compiler-cli` package).
    if (filePath.lastIndexOf('node_modules/') !== 0) {
      return;
    }
    const parsedJson = JSON.parse(readFileSync(filePath, 'utf8'));
    if (
      parsedJson[NGCC_MAIN_FIELD_NAME] &&
      parsedJson[MAIN_FIELD_NAME] !== parsedJson[NGCC_MAIN_FIELD_NAME]
    ) {
      // Update the main field to point to the ngcc main script.
      parsedJson[MAIN_FIELD_NAME] = parsedJson[NGCC_MAIN_FIELD_NAME];
      writeFileSync(filePath, JSON.stringify(parsedJson, null, 2));
    }
  });
}

main()
  .then(() => {
    console.log('✅ Successfully run postinstall script!');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
