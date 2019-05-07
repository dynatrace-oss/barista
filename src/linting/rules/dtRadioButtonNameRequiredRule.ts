import { AttrAst, ElementAst } from '@angular/compiler';
import { BasicTemplateAstVisitor, NgWalker } from 'codelyzer';
import { IRuleMetadata, RuleFailure, Rules } from 'tslint';
import { SourceFile } from 'typescript';
import { addFailure, isElementWithName } from '../utils';

interface RadioButtonGroup {
  name: string;
  startLine: number;
  children: ElementAst[];
}

let radioButtonGroups: RadioButtonGroup[] = [];

class DtRadioButtonVisitor extends BasicTemplateAstVisitor {

  visitElement(element: ElementAst, context: any): any {
    this._validateElement(element);
    super.visitElement(element, context);
  }

  private _validateElement(element: ElementAst): any {

    // Check if a radio group is found.
    if (isElementWithName(element, 'dt-radio-group')) {
      const nameAttr = this._getAttribute(element, 'name');
      const startLine = element.sourceSpan.start.line;
      const radioChildren = element.children.filter((child) => child instanceof ElementAst && child.name === 'dt-radio-button');
      if (nameAttr && radioChildren) {
        radioButtonGroups.push({
          name: nameAttr.value,
          startLine,
          children: radioChildren as ElementAst[],
        });
      }
      // Sort by start line for later checks.
      if (radioButtonGroups.length > 1) {
        radioButtonGroups.sort((a, b) => a.startLine - b.startLine);
      }
      return;
    }

    if (!isElementWithName(element, 'dt-radio-button')) {
      return;
    }

    // Check if the radio button is part of a radio group.
    const radioBtnStartLine = element.sourceSpan.start.line;
    let matchingGroup;
    radioButtonGroups.forEach((group) => {
      // Get the group with the highest start line number that is still below the
      // start line number of the current radio-button.
      // Groups are sorted by startLine (see above).
      if (group.startLine <= radioBtnStartLine) {
        matchingGroup = group;
      }
    });

    if (matchingGroup) {
      const match = this._findMatch(matchingGroup, element);
      if (match) {
        return;
      }
    }

    // If the radio button is not part of a radio group, check for the name attribtue.
    const radioName = this._getAttribute(element, 'name');
    if (radioName && radioName.value && radioName.value.trim().length > 0) {
      return;
    }

    addFailure(this, element, 'When a dt-radio-button is not part of a dt-radio group it must have a name attribute.');
  }

  private _getAttribute(element: ElementAst, attribute: string): AttrAst | undefined {
    return element.attrs.find((attr) => attr.name === attribute);
  }

  private _findMatch(group: RadioButtonGroup, element: ElementAst): ElementAst | undefined {
    return group.children.find((child) => {
      // There may be a better solution for comparing objects, but it works in this case.
      const childObj = JSON.stringify(child);
      const elementObj = JSON.stringify(element);
      if (childObj === elementObj) {
        return true;
      }
      return false;
    });
  }
}

/**
 * The dtRadioButtonNameRequiredRule ensures that a radio button has a name when not part of a radio group.
 *
 * The following example passes the lint checks:
 * <dt-radio-group name="group0">
 *   <dt-radio-button value="aberfeldy">Aberfeldy</dt-radio-button>
 *   <dt-radio-button value="dalmore">Dalmore</dt-radio-button>
 * </dt-radio-group>
 *
 * <dt-radio-button value="dalmore" name="group">Dalmore</dt-radio-button>
 *
 * For the following example the linter throws errors:
 * <dt-radio-button value="myValue">Radio button value</dt-radio-button>
 */
export class Rule extends Rules.AbstractRule {

  static readonly metadata: IRuleMetadata = {
    description: 'Ensures that a radio button has a name attribute when not part of a radiogroup.',
    // tslint:disable-next-line:no-null-keyword
    options: null,
    optionsDescription: 'Not configurable.',
    rationale: 'A radio button that is not part of a radio group must have a name attribute.',
    ruleName: 'dt-radio-button-name-required',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: SourceFile): RuleFailure[] {
    const result = this.applyWithWalker(
      new NgWalker(sourceFile, this.getOptions(), {
        templateVisitorCtrl: DtRadioButtonVisitor,
      })
    );

    // Reset radio button group collection after each file.
    radioButtonGroups = [];
    return result;
  }
}
