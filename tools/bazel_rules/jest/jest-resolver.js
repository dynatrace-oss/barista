const { sync } = require('resolve');
const { readFileSync, existsSync, lstatSync } = require('fs');
const { resolve } = require('path');

// Get the module mappings out of the module mappings file from bazel
const moduleMappingFile = process.env.BAZEL_TEST_MODULE_MAPPING;
// bazel run files helper used to resolve paths that are created with `$(location ...)`
const runFilesHelper = require(`${process.env.BAZEL_NODE_RUNFILES_HELPER}`);

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

  if (existsSync(absolutePath) && lstatSync(absolutePath).isFile()) {
    return absolutePath;
  }

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

  // TODO: lukas.holzer find a more elegant solution for getting the module_root for design tokens
  if (existsSync(`${absolutePath}/generated/index.js`)) {
    return `${absolutePath}/generated/index.js`;
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

  // If we cannot replace the file with a mapping then it might be inside a module without
  // module name so the moduleId will consist out of `dynatrace/path/to/module`
  return resolveModuleFileName(moduleId.replace('dynatrace/', ''));
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
function moduleResolver(moduleId, options) {
  if (moduleId.startsWith('lit-html')) {
    const absPath = runFilesHelper.resolve(
      'dynatrace/tools/bazel_rules/jest/lit-html',
    );
    return resolveModuleFileName(moduleId.replace('lit-html', absPath));
  }

  if (moduleId.startsWith('lit-element')) {
    const absPath = runFilesHelper.resolve(
      'dynatrace/tools/bazel_rules/jest/lit-element/lit-element.js',
    );
    return resolveModuleFileName(moduleId.replace('lit-element', absPath));
  }

  if (moduleId.startsWith('@popperjs')) {
    const absPath = runFilesHelper.resolve(
      'dynatrace/tools/bazel_rules/jest/popperjs',
    );
    return resolveModuleFileName(
      moduleId.replace('@popperjs/core/lib', absPath),
    );
  }

  switch (moduleId) {
    case 'lodash-es':
      return runFilesHelper.resolve('npm/lodash-es/lodash-es.umd.js');
  }

  // resolve workspace imports with the bazel module mappings
  if (moduleId.startsWith('@dynatrace') || moduleId.startsWith('dynatrace')) {
    const resolved = resolvePath(moduleId);
    // if undefined it might be a published @dynatrace import that has to be resolved
    // via the node_modules with the `sync` operation later on
    if (resolved) {
      return resolved;
    }
  }

  try {
    return options.defaultResolver(moduleId, options);
  } catch {
    return sync(moduleId, {
      basedir: options.basedir,
      preserveSymlinks: false,
    });
  }
}

module.exports = moduleResolver;
