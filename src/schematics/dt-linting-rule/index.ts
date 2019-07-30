import {
  JsonAstObject,
  JsonParseMode,
  parseJsonAst,
  Position,
  strings,
} from '@angular-devkit/core';
import {
  apply,
  chain,
  mergeWith,
  move,
  Rule,
  SchematicsException,
  template,
  Tree,
  url,
} from '@angular-devkit/schematics';
import * as path from 'path';
import { getSourceFile } from '../utils/ast-utils';
import { commitChanges, InsertChange } from '../utils/change';
import { DtLintingRuleOptions } from './schema';

function _createRuleName(name: string): string {
  const dasherizedName = strings.dasherize(name);
  const ruleName = dasherizedName.startsWith('dt-')
    ? dasherizedName
    : `dt-${dasherizedName}`;

  return ruleName.endsWith('-rule')
    ? ruleName.substring(0, ruleName.length - '-rule'.length)
    : ruleName;
}

function _parseTslintJson(host: Tree, modulePath: string): JsonAstObject {
  const sourceFile = getSourceFile(host, modulePath);
  const tslintJson = parseJsonAst(sourceFile.text, JsonParseMode.Strict);

  if (tslintJson.kind !== 'object') {
    throw new SchematicsException(
      'Invalid tslint.json: was expecting an object',
    );
  }
  return tslintJson;
}

function _findRulePosition(
  tslintJson: JsonAstObject,
  ruleName: string,
): Position {
  for (const property of tslintJson.properties) {
    if (property.key.value === 'rules') {
      const rules = property.value;

      if (rules.kind !== 'object') {
        throw new SchematicsException(
          'Invalid tslint.json: property "rules" is supposed to be an object',
        );
      }

      const quotedRuleName = `"${ruleName}"`;

      for (const rule of rules.properties) {
        const currentRuleName = rule.key.text;

        if (
          currentRuleName !== '"i18n"' &&
          currentRuleName !== '"no-magic-numbers"' &&
          quotedRuleName.localeCompare(currentRuleName) < 0
        ) {
          return rule.start;
        }
      }
      return rules.end;
    }
  }

  throw new SchematicsException(
    'Invalid tslint.json: Could not find "rules" object',
  );
}

/**
 * Adds the new linting rule to TSLINT.md.
 */
function addLintingRuleToReadme(ruleName: string): Rule {
  return (host: Tree) => {
    const modulePath = path.join('TSLINT.md');
    const sourceFile = getSourceFile(host, modulePath);
    const readmeText = sourceFile.text;
    let tableEntriesPos =
      readmeText.indexOf('\n', readmeText.indexOf('| ----')) + 1;

    for (const line of readmeText.substring(tableEntriesPos).split('\n')) {
      const currentRuleName = line.replace(/^\|\s*`([a-z0-9-]+)`.*$/, '$1');

      if (
        line.charAt(0) !== '|' ||
        ruleName.localeCompare(currentRuleName) < 0
      ) {
        break;
      }
      tableEntriesPos += line.length + 1;
    }

    const toInsert = `| \`${ruleName}\` | +++ Insert linting rule description here +++. |\n`;
    const lintingRuleChange = new InsertChange(
      modulePath,
      tableEntriesPos,
      toInsert,
    );

    return commitChanges(host, lintingRuleChange, modulePath);
  };
}

/**
 * Adds the new linting rule to a specific tslint.json.
 */
function addLintingRuleToTslintJson(
  ruleName: string,
  warningSeverity: boolean,
  modulePath: string,
): Rule {
  return (host: Tree) => {
    const tslintJson = _parseTslintJson(host, modulePath);
    const rulePos = _findRulePosition(tslintJson, ruleName);
    const toInsert = `"${ruleName}": ${
      warningSeverity ? '{ "severity": "warning" }' : true
    },\n    `;
    const lintingRuleChange = new InsertChange(
      modulePath,
      rulePos.offset,
      toInsert,
    );

    return commitChanges(host, lintingRuleChange, modulePath);
  };
}

// tslint:disable-next-line:no-default-export
export default function(options: DtLintingRuleOptions): Rule {
  const severity = options.severity;

  if (severity && severity !== 'warning') {
    throw new SchematicsException(`Unsupported severity level: ${severity}`);
  }

  const ruleName = (options.name = _createRuleName(options.name));
  const category = options.category
    ? strings.dasherize(options.category)
    : undefined;

  if (category) {
    options.category = category;
  }

  const templateSource = apply(url('./files'), [
    template({
      ...strings,
      ...options,
    }),
    move('src'),
  ]);
  const rules = [
    mergeWith(templateSource),
    addLintingRuleToTslintJson(
      ruleName,
      severity === 'warning',
      path.join('src', 'barista-examples', 'tslint.json'),
    ),
    addLintingRuleToTslintJson(
      ruleName,
      severity === 'warning',
      path.join('src', 'linting', 'tslint.json'),
    ),
    addLintingRuleToReadme(ruleName),
  ];

  if (category) {
    const ruleImpl = `${strings.camelize(ruleName)}Rule.ts`;
    const rulesPath = path.join('src', 'linting', 'rules');

    rules.push(
      move(
        path.join(rulesPath, ruleImpl),
        path.join(rulesPath, category, ruleImpl),
      ),
    );
  }
  return chain(rules);
}
