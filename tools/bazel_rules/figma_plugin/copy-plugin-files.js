const { options } = require('yargs');
const { copyFileSync, mkdirSync, existsSync } = require('fs');
const { join } = require('path');

const { manifestJson, codeJs, workerHtml, outPath } = options({
  'manifest-json': { type: 'string' },
  'code-js': { type: 'string' },
  'worker-html': { type: 'string' },
  'out-path': { type: 'string' },
}).argv;

async function main() {
  const outputDir = join(outPath, 'plugin');
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir);
  }
  copyFileSync(manifestJson, join(outputDir, 'manifest.json'));
  copyFileSync(codeJs, join(outputDir, 'code.js'));
  copyFileSync(workerHtml, join(outputDir, 'worker.html'));
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
