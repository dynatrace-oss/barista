import * as path from 'path';

import {
  JsonAstObject,
  JsonParseMode,
  Path,
  Position,
  parseJsonAst,
  strings,
} from '@angular-devkit/core';
import {
  Rule,
  SchematicsException,
  Tree,
  apply,
  chain,
  filter,
  mergeWith,
  move,
  template,
  url,
} from '@angular-devkit/schematics';

import { getSourceFile } from '../utils/ast-utils';
import { InsertChange, commitChanges } from '../utils/change';
import { DtLintingRuleOptions } from './schema';

const TSLINT_MARKDOWN_FILE = path.join('documentation', 'linting.md');
const LINTING_DIRECTORY = path.join('src', 'linting');
const LINTING_RULES_DIRECTORY = path.join(LINTING_DIRECTORY, 'rules');
const LINTING_RULES_TEST_DIRECTORY = path.join(
  LINTING_DIRECTORY,
  'test',
  'rules',
);
const LINTING_TSLINT_CONFIG = path.join(LINTING_DIRECTORY, 'tslint.json');
const BARISTA_EXAMPLES_TSLINT_CONFIG = path.join(
  'src',
  'barista-examples',
  'tslint.json',
);

function _createRuleName(name: string, altText?: string): string {
  let ruleName = strings.dasherize(name);

  if (!ruleName.startsWith('dt-')) {
    ruleName = `dt-${ruleName}`;
  }
  if (ruleName.endsWith('-rule')) {
    ruleName = ruleName.substring(0, ruleName.length - '-rule'.length);
  }
  if (altText && !ruleName.endsWith('-alt-text')) {
    ruleName = `${ruleName}-alt-text`;
  }
  return ruleName;
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
          currentRuleName.startsWith('"dt-') &&
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
function _addLintingRuleToReadme(ruleName: string, altText?: string): Rule {
  return (host: Tree) => {
    const modulePath = TSLINT_MARKDOWN_FILE;
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

    const toInsert =
      altText === undefined
        ? `| \`${ruleName}\` | +++ Insert linting rule description here +++. |\n`
        : `| \`${ruleName}\` | A \`${altText}\` must always have an alternative text in form of an \`aria-label\` or an \`aria-labelledby\` attribute. |\n`;
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
function _addLintingRuleToTslintJson(
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

function _altTextFilterPredicate(p: Path): boolean {
  return (
    p !== '/linting/rules/__name@camelize__Rule.ts' &&
    p !== '/linting/test/rules/__name@dasherize__-rule/test.ts.lint'
  );
}

function _squigglyLine(altText: string): string {
  let line = '~~'; // start with 2 tildes for the angle brackets

  for (let i = 0; i < altText.length; i++) {
    line += '~';
  }
  return line;
}

// tslint:disable-next-line:no-default-export
export default function(options: DtLintingRuleOptions): Rule {
  options.name = _createRuleName(options.name, options.alttext);

  if (options.category) {
    options.category = strings.dasherize(options.category);
  }

  const templateRules = options.alttext
    ? [
        filter(_altTextFilterPredicate),
        template({
          ...strings,
          ...options,
          ...{ squigglyLine: _squigglyLine(options.alttext) },
        }),
        move('src'),
      ]
    : [template({ ...strings, ...options }), move('src')];
  const templateSource = apply(url('./files'), templateRules);

  const rules = [
    mergeWith(templateSource),
    _addLintingRuleToTslintJson(
      options.name,
      options.severity === 'warning',
      BARISTA_EXAMPLES_TSLINT_CONFIG,
    ),
    _addLintingRuleToTslintJson(
      options.name,
      options.severity === 'warning',
      LINTING_TSLINT_CONFIG,
    ),
    _addLintingRuleToReadme(options.name, options.alttext),
  ];

  if (options.alttext) {
    const testDirectory = path.join(
      LINTING_RULES_TEST_DIRECTORY,
      `${strings.dasherize(options.name)}-rule`,
    );

    rules.push(
      move(
        path.join(
          LINTING_RULES_DIRECTORY,
          `${strings.camelize(options.name)}AltTextRule.ts`,
        ),
        path.join(
          LINTING_RULES_DIRECTORY,
          `${strings.camelize(options.name)}Rule.ts`,
        ),
      ),
    );
    rules.push(
      move(
        path.join(testDirectory, 'alt-text-test.ts.lint'),
        path.join(testDirectory, 'test.ts.lint'),
      ),
    );
  }

  if (options.category) {
    const ruleImpl = `${strings.camelize(options.name)}Rule.ts`;

    rules.push(
      move(
        path.join(LINTING_RULES_DIRECTORY, ruleImpl),
        path.join(LINTING_RULES_DIRECTORY, options.category, ruleImpl),
      ),
    );
  }

  return chain(rules);
}
