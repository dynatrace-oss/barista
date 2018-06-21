import { ElementAst, AttrAst } from '@angular/compiler';
import { IRuleMetadata, RuleFailure, Rules, IOptions } from 'tslint/lib';
import { SourceFile } from 'typescript/lib/typescript';
import { NgWalker } from 'codelyzer/angular/ngWalker';
import { BasicTemplateAstVisitor } from 'codelyzer/angular/templates/basicTemplateAstVisitor';
import { readFileSync } from 'fs';
import { join } from 'path';

interface DtIconMetadata { icons: string []; }

let iconMetadata: DtIconMetadata;
try {
  iconMetadata = JSON.parse(readFileSync(
    join('node_modules', '@dynatrace', 'dt-iconpack', 'metadata.json'), 'utf8'
  ));
} catch (err) {
  console.log('No metadata.json file found in @dynatrace/dt-iconpack. Make sure that you have it installed');
}

export class Rule extends Rules.AbstractRule {
  static readonly metadata: IRuleMetadata = {
    description: 'Ensures the correct names for icons are used.',
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'The name for an icon must be a valid name',
    ruleName: 'dtIconNames',
    type: 'functionality',
    typescriptOnly: true,
  };

  static readonly NO_NAME_STRING = 'Missing name property/binding on dt-icon';
  static readonly WRONG_NAME_STRING = (wrongName: string) => `'${wrongName}' is not a valid icon name.`;

  apply(sourceFile: SourceFile): RuleFailure[] {
    return this.applyWithWalker(new NgWalker(sourceFile, this.getOptions(), { templateVisitorCtrl: DtIconTemplateVisitor }));
  }
}

export const getNoNameMessage = (): string => Rule.NO_NAME_STRING;
export const getWrongNameMessage = (wrongName: string): string => Rule.WRONG_NAME_STRING(wrongName);

class DtIconTemplateVisitor extends BasicTemplateAstVisitor {
  visitElement(prop: ElementAst, context: any): any {
    this.validateElement(prop);
    super.visitElement(prop, context);
  }

  /**
   * Validate all dt-icon components
   * checks for attribute name or binding for name exisitng
   * checks name set as attribute to be valid
   */
  private validateElement(prop: ElementAst): any {
    const { name, inputs, attrs } = prop;
    if (name !== 'dt-icon') {
      return;
    }
    // check for binding
    let hasBinding = false;
    if (inputs && inputs.length > 0) {
      hasBinding = inputs.some((input) => input.name === 'name');
    }
    // check for name attribute
    let attrAst: AttrAst | undefined;
    if (attrs && attrs.length > 0) {
      attrAst = attrs.find((attr) => attr.name === 'name');
    }

    // passes if attribute value is valid or has a binding
    if ((attrAst && iconMetadata && iconMetadata.icons.includes(attrAst.value)) || hasBinding) {
      return;
    }

    const startOffset = prop.sourceSpan.start.offset;
    const endOffset = prop.sourceSpan.end.offset;

    if (attrAst) {
      this.addFailureFromStartToEnd(startOffset, endOffset, getWrongNameMessage(attrAst.value));
    } else {
      this.addFailureFromStartToEnd(startOffset, endOffset, getNoNameMessage());
    }
  }
}
