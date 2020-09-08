const { runCLI } = require('jest');
const { resolve, join, dirname, parse, sep } = require('path');
const { readFileSync, writeFileSync } = require('fs');
const { argv } = require('yargs');

// Path of the test.sh binary that gets created from the nodejs_test
const { TEST_BINARY } = process.env;
// Bazels node runfiles helper
const RUNFILES_HELPER = require(process.env.BAZEL_NODE_RUNFILES_HELPER);

/**
 * Updates the jest config json with additional properties
 * @param {string} configPath Path to the jest config json
 * @param {string} suiteName The name of the test suite
 * @param {string} suitePath The path of the package
 */
function updateJestConfig(suiteName, config = undefined) {
  const suitePath = dirname(config || TEST_BINARY);
  const configPath = resolve(config || join(suitePath, 'jest.config.json'));
  const { dir, ext, name } = parse(configPath);
  const parsed = config
    ? JSON.parse(readFileSync(configPath, 'utf-8'))
    : { name: suitePath.split(sep).pop() };

  parsed.reporters = [
    'default',
    [
      'jest-junit',
      {
        suiteName: `//${suitePath}:${suiteName}`,
        outputDirectory: dirname(process.env.XML_OUTPUT_FILE),
        outputName: './test.xml',
        classNameTemplate: '{classname}-{title}',
        titleTemplate: '{classname}-{title}',
        ancestorSeparator: ' › ',
        usePathForSuiteName: 'true',
      },
    ],
  ];

  // Ensure that jest prints out all console.logs
  parsed.verbose = false;

  const updatedFileName = join(dir, `${name}-updated${ext}`);
  writeFileSync(updatedFileName, JSON.stringify(parsed, undefined, 2));

  return updatedFileName;
}

async function main() {
  const { jestConfig, setupFile, files, suite } = argv;
  const jestConfigPath = updateJestConfig(suite, jestConfig);

  const resolvedFiles = files
    .split(',')
    .map((source) =>
      join(RUNFILES_HELPER.package, source).replace(/ts$/, 'js'),
    );

  const { results } = await runCLI(
    {
      /**
       * This is a hack to avoid using the jest-haste-map fs that does not support symbolic links
       * https://github.com/facebook/metro/issues/1#issuecomment-641633646
       */
      _: resolvedFiles,
      setupFilesAfterEnv: setupFile
        ? [resolve(setupFile).replace(/ts$/, 'js')]
        : [],
      runTestsByPath: true,
      verbose: true,
      expand: true,
      cache: false,
      resolver: resolve('tools/bazel_rules/jest/jest-resolver.js'),
      rootDir: resolve('./'),
      colors: true,
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
