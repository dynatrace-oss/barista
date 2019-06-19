import * as ts from 'typescript';
import {
  Tree,
  SchematicsException,
  Rule,
} from '@angular-devkit/schematics';
import { InsertChange, commitChanges } from './change';
import { strings } from '@angular-devkit/core';
import { DtComponentOptions } from '../dt-component/schema';
import { dasherize } from '@angular-devkit/core/src/utils/strings';
import { join } from 'path';
import { addNavItem } from './nav-items';

export function getSourceFile(host: Tree, path: string): ts.SourceFile {
  const buffer = host.read(path);
  if (!buffer) {
    throw new SchematicsException(`File ${path} does not exist.`);
  }
  const content = buffer.toString();
  const source = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);

  return source;
}

/**
 * Find all nodes from the AST in the subtree of node of SyntaxKind kind.
 */
export function findNodes(node: ts.Node, kind: ts.SyntaxKind, max = Infinity): ts.Node[] {
  if (!node || max == 0) {
    return [];
  }

  const arr: ts.Node[] = [];
  if (node.kind === kind) {
    arr.push(node);
    max--;
  }
  if (max > 0) {
    for (const child of node.getChildren()) {
      findNodes(child, kind, max).forEach(node => {
        if (max > 0) {
          arr.push(node);
        }
        max--;
      });

      if (max <= 0) {
        break;
      }
    }
  }

  return arr;
}

/**
 * Get all the nodes from a source.
 */
export function getSourceNodes(sourceFile: ts.SourceFile): ts.Node[] {
  const nodes: ts.Node[] = [sourceFile];
  const result = [];

  while (nodes.length > 0) {
    const node = nodes.shift();

    if (node) {
      result.push(node);
      if (node.getChildCount(sourceFile) >= 0) {
        nodes.unshift(...node.getChildren());
      }
    }
  }

  return result;
}

/**
 * Adds an import to the existing @dynatrace/angular-components import declaration
 */
export function addDynatraceAngularComponentsImport(source: ts.SourceFile, path: string, symbolName: string): InsertChange {
  const importNodes = findNodes(source, ts.SyntaxKind.ImportDeclaration)
    .filter((node: ts.ImportDeclaration) =>
    node.moduleSpecifier && node.moduleSpecifier.getText() === '\'@dynatrace/angular-components\'');

  if (importNodes.length === 0) {
    throw new SchematicsException(`No @dynatrace/angular-components import found in ${path}`);
  }
  /**
   * add it to the last @dynatrace/angular-components import
   */
  const lastImport = importNodes[importNodes.length - 1];
  const namedImports = findNodes(lastImport, ts.SyntaxKind.NamedImports) as ts.NamedImports[];

  if (namedImports.length === 0) {
    throw new SchematicsException(`No named imports found from @dynatrace/angular-components in ${path}`);
  }
  const lastNamedImport = namedImports[namedImports.length - 1];
  const end = lastNamedImport.elements.end;
  // Get the indentation of the last element, if any.
  const indentation = getIndentation(lastNamedImport.elements);
  const toInsert = `${indentation}${symbolName},`;
  return new InsertChange(path, end, toInsert);
}

/**
 * Gets the indentation string for the last entry in NodeArray
 */
export function getIndentation(elements: ts.NodeArray<any> | ts.Node[]): string {
  let indentation = '\n';
  if (elements.length > 0) {
    const text = elements[elements.length - 1].getFullText();
    const matches = text.match(/^\r?\n\s*/);
    if (matches && matches.length > 0) {
      indentation = matches[0];
    }
  }
  return indentation;
}

export function addImport(
  sourcePath: string,
  sourceFile: ts.SourceFile,
  importName: string,
  importLocation: string
): InsertChange {
  /**
   * get all importnodes if there are any and insert a new one at the end
   */
  const importNodes = findNodes(sourceFile, ts.SyntaxKind.ImportDeclaration);
  let pos = 0;
  if (importNodes.length > 0) {
    pos = importNodes[importNodes.length - 1].getEnd();
  }
  const toInsert = `\nimport { ${importName} } from ${importLocation}`;
  return new InsertChange(sourcePath, pos, toInsert);
}

export function addDynatraceSubPackageImport(
  sourcePath: string,
  sourceFile: ts.SourceFile,
  options: DtComponentOptions
): InsertChange {
  return addImport(sourcePath, sourceFile, options.moduleName, `'@dynatrace/angular-components/${dasherize(options.name)}';`);
}

export type NgModuleDefinition = 'imports' | 'declarations' | 'exports';

export function addToNgModule(
  sourcePath: string,
  sourceFile: ts.SourceFile,
  name: string,
  position: NgModuleDefinition,
  filter: RegExp = /Dt\w*?Module/
): InsertChange {
  const assignments = findNodes(sourceFile, ts.SyntaxKind.PropertyAssignment);
  const importSyntaxLists = assignments
    .filter((c) => c.getText().startsWith(position)) // filter by position
    .map((c) => c.getChildren())
    .reduce((acc, val) => acc.concat(val), []) // flatten
    .filter((c) => c.kind === ts.SyntaxKind.ArrayLiteralExpression) // filter out arrays
    .filter((c) => c.getText().match(filter)) // filter the one with other Dt***Module declarations
    .map((c) => c.getChildren())
    .reduce((acc, val) => acc.concat(val), []) // flatten
    .filter((c) => c.kind === ts.SyntaxKind.SyntaxList) as ts.SyntaxList[]; // remove tokens
  const indentation = getIndentation(importSyntaxLists);
  const toInsert = `${indentation}${name},`;
  return new InsertChange(sourcePath, importSyntaxLists[0].end, toInsert);
}

/**
 * Adds the declarations
 */
export function addDeclarationsToDevAppModule(name: string): Rule {
  return (host: Tree) => {
    const modulePath = join('src', 'dev-app', 'app.module.ts');
    const sourceFile = getSourceFile(host, modulePath);
    const importName = `${strings.classify(name)}Demo`;
    const importLocation = `'./${name}/${name}-demo.component';`;
    const importChange = addImport(modulePath, sourceFile, importName, importLocation);
    /**
     * add it to the declarations in the module
     */
    const assignments = findNodes(sourceFile, ts.SyntaxKind.PropertyAssignment) as ts.PropertyAssignment[];
    const assignment = assignments.find((a: ts.PropertyAssignment) => a.name.getText() === 'declarations');
    if (assignment === undefined) {
      throw Error("No AppModule 'declarations' section found");
    }

    const arrLiteral = assignment.initializer as ts.ArrayLiteralExpression;
    const elements = arrLiteral.elements;
    const end = arrLiteral.elements.end;

    const indentation = getIndentation(elements);
    const toInsert = `${indentation}${strings.classify(name)}Demo,`;
    const importsChange = new InsertChange(modulePath, end, toInsert);

    const changes = [importChange, importsChange];
    return commitChanges(host, changes, modulePath);
  };
}

/**
 * Adds the declaration to the baristaExamples Module
 */
export function addDynatraceAngularComponentsBaristaExampleModule(
  sourceFile: ts.SourceFile,
  sourcePath: string,
  name: string
): InsertChange {
  const dtModulesDeclaration = findNodes(sourceFile, ts.SyntaxKind.VariableDeclaration)
    .find((declaration: ts.VariableDeclaration) =>
      (declaration.name as ts.Identifier).text === 'DT_MODULES');

  if (dtModulesDeclaration === undefined) {
    throw Error(`The DT_MODULES 'declarations' was not found in ${sourcePath}`);
  }
  const elements = ((dtModulesDeclaration as ts.VariableDeclaration).initializer as ts.ArrayLiteralExpression)
    .elements;
  const indentation = getIndentation(elements);
  // calculate end position in ArrayLiteral before closing bracket.
  const insertPosition = elements.end;
  return new InsertChange(sourcePath, insertPosition, `${indentation}${name},`);
}

/**
 * Adds a new navitem inside the navitems
 */
export function addNavitemToDevApp(name: string): Rule {
  return (host: Tree) => addNavItem(host, { name }, join('src', 'dev-app', 'devapp.component.ts'));
}
