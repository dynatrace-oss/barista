import { readFileSync } from 'fs';
import { basename, dirname, relative } from 'path';

import { strings } from '@angular-devkit/core';
import * as ts from 'typescript';

import { buildConfig } from '../build-config';

const { examplesDir } = buildConfig;

export interface ExampleMetadata {
  component: string;
  sourcePath: string;
}

export interface AppComponentRouteSetup {
  name: string;
  examples: Array<{
    name: string;
    route: string;
    className: string;
    import: string;
  }>;
}

/** Parses the examples and collects all data */
export function getExampleMetadata(sourceFiles: string[]): ExampleMetadata[] {
  const parsedData: Set<ExampleMetadata> = new Set();
  sourceFiles.forEach(sourceFilePath => {
    const content = readFileSync(sourceFilePath, { encoding: 'utf-8' });
    const fileName = basename(sourceFilePath);
    const components = retrieveExampleClassNames(fileName, content);
    components.forEach(component => {
      const metadata: ExampleMetadata = {
        component,
        sourcePath: relative(examplesDir, sourceFilePath),
      };
      parsedData.add(metadata);
    });
  });
  return [...parsedData];
}

/** Parse the AST of the given source file and collects Angular component metadata. */
export function retrieveExampleClassNames(
  fileName: string,
  content: string,
): string[] {
  const sourceFile = ts.createSourceFile(
    fileName,
    content,
    ts.ScriptTarget.Latest,
    false,
  );
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
export function buildImportsTemplate(data: ExampleMetadata): string {
  const relativeSrcPath = data.sourcePath
    .replace(/\\/g, '/')
    .replace('.ts', '');

  return `import { ${data.component} } from './${relativeSrcPath}';`;
}

/** Generates the meta information for each route */
export function generateRouteMetadata(
  parsedData: ExampleMetadata[],
): AppComponentRouteSetup[] {
  return parsedData.reduce((aggr: AppComponentRouteSetup[], val) => {
    const componentName = dirname(val.sourcePath);
    let index = aggr.findIndex(item => item.name === componentName);
    if (index === -1) {
      index = aggr.push({ name: componentName, examples: [] }) - 1;
    }
    const dasherized = strings.dasherize(val.component);
    aggr[index].examples.push({
      name: dasherized,
      route: `${componentName}/${dasherized}`,
      className: val.component,
      import: buildImportsTemplate(val),
    });
    return aggr;
  }, []);
}
