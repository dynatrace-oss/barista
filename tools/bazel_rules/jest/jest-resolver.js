const { sync } = require('resolve');
const { readFileSync, existsSync } = require('fs');
const { dirname, resolve, parse } = require('path');

// Get the module mappings out of the module mappings file from bazel
const moduleMappingFile = process.env.BAZEL_TEST_MODULE_MAPPING;

if (!moduleMappingFile) {
  throw new Error('No bazel test directory provided!');
}
const mappings = JSON.parse(readFileSync(moduleMappingFile, 'utf-8'));
const moduleMappings = new Map();

for (const [key, value] of Object.entries(mappings.modules)) {
  // As the paths are an array in the tsConfig use the first one for resolving.
  moduleMappings.set(
    key,
    value
      .find((path) => path.startsWith('bazel-out'))
      .replace(/^bazel-out.+\/bin\//, ''), //replace the bazel out as we want to resolve it in the test.sh.runfiles folder
  );
}

/**
 * Try to resolve a folder or filename as js file or as barrel file.
 * @param {string} fileName
 */
function resolveModuleFileName(fileName) {
  const absolutePath = resolve(fileName);

  if (existsSync(`${absolutePath}.js`)) {
    return `${absolutePath}.js`;
  }

  if (existsSync(`${absolutePath}/index.js`)) {
    return `${absolutePath}/index.js`;
  }

  // TODO: lukas.holzer find a more elegant solution for getting the module_root
  if (existsSync(`${absolutePath}/src/index.js`)) {
    return `${absolutePath}/src/index.js`;
  }
}

/**
 * Try to resolve a moduleId based on the module mappings that are created by bazel
 * @param {string} moduleId
 */
function resolvePath(moduleId) {
  if (moduleMappings.has(moduleId)) {
    return resolveModuleFileName(moduleMappings.get(moduleId));
  }

  const item = [...moduleMappings.keys()].find((item) =>
    moduleId.startsWith(item),
  );

  if (item) {
    return resolveModuleFileName(
      moduleId.replace(item, moduleMappings.get(item)),
    );
  }
}

/**
 * The jest default resolver function.
 *
 * @callback defaultResolver
 * @param {*} request
 * @param {*} options
 */
/**
 * A Custom resolver for modules and files that is used for bazel jest
 * @param {string} moduleId The moduleId or filepath that should be resolved
 * @param {Object} options
 * @param {string} options.basedir
 * @param {defaultResolver} options.defaultResolver
 * @param {string} options.extensions
 * @param {string} options.moduleDirectory
 * @param {string} options.paths
 * @param {string} options.rootDir
 */
function main(moduleId, options) {
  const { basedir, extensions, moduleDirectory, paths } = options;

  const resolveOpts = {
    basedir,
    extensions,
    moduleDirectory,
    paths,
    preserveSymlinks: true,
  };

  // resolve workspace imports with the bazel module mappings
  if (moduleId.includes('@dynatrace')) {
    const resolved = resolvePath(moduleId);
    // if undefined it might be a published @dynatrace import that has to be resolved
    // via the node_modules with the `sync` operation later on
    if (resolved) {
      return resolved;
    }
  }

  try {
    return sync(moduleId, resolveOpts);
  } catch (e) {
    const parsed = parse(moduleId);
    const directoryNamedId = moduleId + path.sep + parsed.name;
    return resolve.sync(directoryNamedId, resolveOpts);
  }
}

module.exports = main;
