const { writeFileSync, readFileSync } = require('fs');
const { posix } = require('path');

function main(args) {
  if (args.length < 3) {
    console.error(
      'Usage: $0 input.tsconfig.json output.tsconfig.json newRoot binDir',
    );
  }

  const [input, output, newRoot, binDir] = args;

  const data = JSON.parse(readFileSync(input, 'utf-8'));

  const { compilerOptions, bazelOptions } = data;

  // Relative path to the execroot that refers to the directory for the ES5 output files.
  const newOutputBase = posix.join(binDir, newRoot);

  // Update the compiler options to produce ES5 output. Also ensure that the new ES5 output
  // directory is used.
  compilerOptions['target'] = 'es5';
  compilerOptions['outDir'] = posix.join(compilerOptions['outDir'], newRoot);

  bazelOptions['es5Mode'] = true;
  bazelOptions['tsickleExternsPath'] = bazelOptions[
    'tsickleExternsPath'
  ].replace(binDir, newOutputBase);

  if (data['angularCompilerOptions']) {
    const { angularCompilerOptions } = data;
    // Don't enable tsickle's closure conversions
    angularCompilerOptions['annotateForClosureCompiler'] = false;
    // Note: It's important that the "expectedOut" is only modified in a way that still
    // keeps posix normalized paths. Otherwise this could cause unexpected behavior because
    // ngc-wrapped is expecting POSIX paths and the TypeScript Bazel rules by default only pass
    // POSIX paths as well.
    angularCompilerOptions['expectedOut'] = angularCompilerOptions[
      'expectedOut'
    ].map((f) => f.replace(/\.mjs$/, '.js').replace(binDir, newOutputBase));
  }
  writeFileSync(output, JSON.stringify(data, undefined, 2));
}

if (require.main === module) {
  process.exitCode = main(process.argv.slice(2));
}
