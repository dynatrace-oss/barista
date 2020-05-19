const { runCLI } = require('jest');
const { resolve, join, dirname, parse } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { argv } = require('yargs');

/**
 * Updates the jest config json with additional properties
 * @param {string} configPath Path to the jest config json
 * @param {string} suiteName The name of the test suite
 * @param {string} suitePath The path of the package
 */
function updateJestConfig(configPath, suiteName, suitePath) {
  const { dir, ext, name } = parse(configPath);
  const parsed = JSON.parse(readFileSync(configPath, 'utf-8'));

  parsed.reporters = [
    'default',
    [
      'jest-junit',
      {
        suiteName: `//${suitePath}:${suiteName}`,
        outputDirectory: dirname(process.env.XML_OUTPUT_FILE),
        outputName: './unit-test.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ];

  const updatedFileName = `${dir}/${name}-updated${ext}`;
  writeFileSync(updatedFileName, JSON.stringify(parsed, undefined, 2));

  return updatedFileName;
}

async function main() {
  const { jestConfig, setupFile, files, suite } = argv;
  const jestConfigPath = updateJestConfig(
    resolve(jestConfig),
    suite,
    dirname(jestConfig),
  );
  const base = dirname(jestConfigPath);
  const modulesDirectory = resolve('../npm/node_modules');

  process.env.BAZEL_TEST_MODULE_MAPPING = `${dirname(
    jestConfig,
  )}/_${suite}.module_mappings.json`;

  const resolvedFiles = files
    .split(',')
    .map((source) => join(base, source).replace(/ts$/, 'js'));
  const testSetupFile = resolve(setupFile).replace(/ts$/, 'js');

  const { results } = await runCLI(
    {
      /**
       * This is a hack to avoid using the jest-haste-map fs that does not support symbolic links
       * https://github.com/facebook/metro/issues/1#issuecomment-641633646
       */
      _: resolvedFiles,
      runTestsByPath: true,
      moduleDirectories: [modulesDirectory],
      verbose: true,
      resolver: resolve('tools/bazel_rules/jest/jest-resolver.js'),
      rootDir: resolve('./'),
      colors: false,
      setupFilesAfterEnv: [testSetupFile],
    },
    [jestConfigPath],
  );

  if (!results.success) {
    throw new Error(`Failed executing jest tests`);
  }
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
