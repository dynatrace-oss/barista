import * as fs from 'fs';
import { join } from 'path';

import { italic, red } from 'chalk';
import * as ts from 'typescript';

import { DocsParser } from './docs-parser';

class GenerateDocsTask {
  tsConfigPath: string;
  compilerOptions: ts.CompilerOptions;

  constructor(
    public projectDir: string,
    public outputFile: string,
    tsConfigPath?: string,
  ) {
    this.tsConfigPath = tsConfigPath || join(projectDir, 'tsconfig.json');
    if (!fs.existsSync(projectDir)) {
      console.error(
        red(
          `The specified directory is not referring to a project directory: ${projectDir}`,
        ),
      );
      process.exit(1);
    }
    if (!fs.existsSync(this.tsConfigPath)) {
      console.error(
        red(
          `The specified directory is not referring to a project directory. ` +
            `There must be a ${italic(
              'tsconfig.json',
            )} file in the project directory.`,
        ),
      );
      process.exit(1);
    }

    const parsed = parseTsconfigFile(this.tsConfigPath, this.projectDir);
    this.compilerOptions = parsed.options;
  }

  run() {
    const fileNames = fs
      .readdirSync(this.projectDir, { withFileTypes: true })
      .filter(dirOrFile => dirOrFile.isDirectory())
      .map(dir => join(this.projectDir, dir.name))
      .filter(dir => fs.existsSync(join(dir, 'package.json')))
      .map(dir => join(dir, 'index.ts'));

    const packages = new DocsParser(
      this.projectDir,
      this.compilerOptions,
      fileNames,
    ).run();

    fs.writeFileSync(this.outputFile, JSON.stringify(packages));
  }
}

export function parseTsconfigFile(
  tsconfigPath: string,
  basePath: string,
): ts.ParsedCommandLine {
  // tslint:disable: no-unbound-method
  const { config } = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  const parseConfigHost = {
    useCaseSensitiveFileNames: ts.sys.useCaseSensitiveFileNames,
    fileExists: ts.sys.fileExists,
    readDirectory: ts.sys.readDirectory,
    readFile: ts.sys.readFile,
  };
  // tslint:enable: no-unbound-method

  return ts.parseJsonConfigFileContent(config, parseConfigHost, basePath, {});
}

/** Entry-point for the release staging script. */
if (require.main === module) {
  const root = join(__dirname, '../../');
  new GenerateDocsTask(
    join(root, '/src/lib/'),
    join(root, '_docs.json'),
    join(root, '/tsconfig.json'),
  ).run();
}
