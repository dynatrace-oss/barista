import { strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import * as path from 'path';
import { getSourceFile } from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import { DtLintOptions } from './schema';

/**
 * Adds the new linting rule to TSLINT.md.
 */
function addLintingRuleToReadme(options: DtLintOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('TSLINT.md');
    const sourceFile = getSourceFile(host, modulePath);
    const readmeText = sourceFile.text;
    const end = readmeText.indexOf('\n', readmeText.indexOf('| ----')) + 1;
    const toInsert = `| \`${options.name}\` | [Insert linting rule description here] |\n`;
    const lintingRuleChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [lintingRuleChange], modulePath);
  };
}

/**
 * Adds the new linting rule to tslint.json in src/barista-examples.
 */
function addLintingRuleToBaristaExamples(options: DtLintOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'barista-examples', 'tslint.json');
    const sourceFile = getSourceFile(host, modulePath);
    const end =
      sourceFile.text.indexOf('"rules": {') + '"rules": {\n    '.length;
    const toInsert = `"${options.name}": true,\n    `;
    const lintingRuleChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [lintingRuleChange], modulePath);
  };
}

/**
 * Adds the new linting rule to tslint.json in src/linting.
 */
function addLintingRuleToLinting(options: DtLintOptions): Rule {
  return (host: Tree) => {
    const modulePath = path.join('src', 'linting', 'tslint.json');
    const sourceFile = getSourceFile(host, modulePath);
    const end =
      sourceFile.text.indexOf('"rules": {') + '"rules": {\n    '.length;
    const toInsert = `"${options.name}": true,\n    `;
    const lintingRuleChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [lintingRuleChange], modulePath);
  };
}

// tslint:disable-next-line:no-default-export
export default function(options: DtLintOptions): Rule {
  const templateSource = apply(url('./files'), [
    template({
      ...strings,
      ...options,
    }),
    move('src'),
  ]);

  return chain([
    mergeWith(templateSource),
    addLintingRuleToLinting(options),
    addLintingRuleToBaristaExamples(options),
    addLintingRuleToReadme(options),
  ]);
}
