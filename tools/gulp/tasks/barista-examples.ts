import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';
import { sync as glob } from 'glob';
import { task } from 'gulp';
import { buildConfig } from '../build-config';

const { examplesDir, examplesOutputDir } = buildConfig;

interface ExampleMetadata {
  component: string;
  sourcePath: string;
}

/** Parse the AST of the given source file and collect Angular component metadata. */
export function retrieveExampleClassNames(fileName: string, content: string): string[] {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, false);
  const componentClassNames: string[] = [];
  // tslint:disable-next-line:no-any
  const visitNode = (node: any): void => {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      if (node.decorators && node.decorators.length) {
        for (const decorator of node.decorators) {
          if (decorator.expression.expression.text === 'Component') {
            componentClassNames.push(node.name.text);
          }
        }
      }
    }

    ts.forEachChild(node, visitNode);
  };

  visitNode(sourceFile);
  return componentClassNames;
}

/** Build ES module import statements for the given example metadata. */
function buildImportsTemplate(data: ExampleMetadata): string {
  const relativeSrcPath = data.sourcePath.replace(/\\/g, '/').replace('.ts', '');

  return `import { ${data.component} } from './${relativeSrcPath}';`;
}

/** Inlines the example module template with the specified parsed data. */
function populateExampleModuleTemplate(parsedData: ExampleMetadata[]): string {
  const exampleImports = parsedData.map((m) => buildImportsTemplate(m)).join('\n');
  const exampleList = parsedData.map((m) => m.component);

  return fs.readFileSync(require.resolve('./examples.module.template'), 'utf8')
    .replace('${imports}', exampleImports)
    .replace('${examples}', `[\n  ${exampleList.join(',\n  ')},\n]`);
}

/**
 * Generates the example module from the given source files and writes it to a specified output
 * file.
 */
function generateExampleModule(sourceFiles: string[], outputFile: string, baseDir: string): void {
  const parsedData: Set<ExampleMetadata> = new Set();
  sourceFiles.forEach((sourceFilePath) => {
    const content = fs.readFileSync(sourceFilePath, { encoding: 'utf-8' });
    const fileName = path.basename(sourceFilePath);
    const components = retrieveExampleClassNames(fileName, content);
    components.forEach((component) => {
      const metadata: ExampleMetadata = {
        component,
        sourcePath: path.relative(examplesDir, sourceFilePath),
      };
      parsedData.add(metadata);
    })
  })
  const generatedModuleFile = populateExampleModuleTemplate([...parsedData]);
  const generatedFilePath = path.join(baseDir, outputFile);
  if (!fs.existsSync(path.dirname(generatedFilePath))) {
    fs.mkdirSync(path.dirname(generatedFilePath));
  }
  fs.writeFileSync(generatedFilePath, generatedModuleFile);
}

/**
 * Creates the examples module
 */
task('build-examples-module', () => {
  generateExampleModule(glob(path.join(examplesDir, '*/*.ts')), 'examples.module.ts', examplesOutputDir);
});
