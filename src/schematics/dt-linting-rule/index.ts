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
import { DtLintingRuleOptions } from './schema';

function createRuleName(name: string): string {
  const dasherizedName = strings.dasherize(name);
  const ruleName = dasherizedName.startsWith('dt-')
    ? dasherizedName
    : `dt-${dasherizedName}`;

  // TODO ChMa: strip '-rule' as well?
  return ruleName;
}

/**
 * Adds the new linting rule to TSLINT.md.
 */
function addLintingRuleToReadme(ruleName: string): Rule {
  return (host: Tree) => {
    const modulePath = path.join('TSLINT.md');
    const sourceFile = getSourceFile(host, modulePath);
    const readmeText = sourceFile.text;
    const end = readmeText.indexOf('\n', readmeText.indexOf('| ----')) + 1;
    const toInsert = `| \`${ruleName}\` | ~~~Insert linting rule description here~~~. |\n`;
    const lintingRuleChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [lintingRuleChange], modulePath);
  };
}

/**
 * Adds the new linting rule to a specific tslint.json.
 */
function addLintingRuleToTslintJson(
  ruleName: string,
  modulePath: string,
): Rule {
  return (host: Tree) => {
    const sourceFile = getSourceFile(host, modulePath);
    const end =
      sourceFile.text.indexOf('"rules": {') + '"rules": {\n    '.length;
    const toInsert = `"${ruleName}": true,\n    `;
    const lintingRuleChange = new InsertChange(modulePath, end, toInsert);

    return commitChanges(host, [lintingRuleChange], modulePath);
  };
}

// tslint:disable-next-line:no-default-export
export default function(options: DtLintingRuleOptions): Rule {
  const ruleName = createRuleName(options.name);
  const templateSource = apply(url('./files'), [
    template({
      ...strings,
      ...options,
    }),
    move('src'),
  ]);

  return chain([
    mergeWith(templateSource),
    addLintingRuleToTslintJson(
      ruleName,
      path.join('src', 'barista-examples', 'tslint.json'),
    ),
    addLintingRuleToTslintJson(
      ruleName,
      path.join('src', 'linting', 'tslint.json'),
    ),
    addLintingRuleToReadme(ruleName),
  ]);
}
