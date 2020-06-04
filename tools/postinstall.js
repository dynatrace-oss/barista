// This script will be executed on npm postinstall and is a
// migration script for the phase where we support building with bazel
// and without.
const { execSync } = require('child_process');

// when running with bazel we need to perform a ngcc to compile
// all dependencies for ivy. If we are not run by bazel just build
// the workspace library. With bazel this is already in the build cache.
if (process.env.BAZEL_NPM_INSTALL) {
  execSync('node ./node_modules/.bin/ngcc');
} else {
  execSync('npm run ng build workspace');
}
