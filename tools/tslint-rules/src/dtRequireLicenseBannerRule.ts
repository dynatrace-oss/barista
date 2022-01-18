/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as Lint from 'tslint';
import * as ts from 'typescript';

/** License banner that is placed at the top of every public TypeScript file. */
const licenseBanner = `/**
 * @license
 * Copyright 2022 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */`;

/** Failure message that will be shown if a license banner is missing. */
const ERROR_MESSAGE =
  'Missing license header in this TypeScript file. ' +
  'Every TypeScript file of the library needs to have the Dynatrace license banner at the top.';

/** TSLint fix that can be used to add the license banner easily. */
const tslintFix = Lint.Replacement.appendText(0, licenseBanner + '\n\n');

/**
 * Rule that walks through all TypeScript files of public packages and shows failures if a
 * file does not have the license banner at the top of the file.
 */
export class Rule extends Lint.Rules.AbstractRule {
  static readonly metadata: Lint.IRuleMetadata = {
    description:
      'Ensures that all files of public packages do have the license banner at the top of the file.',
    options: null,
    optionsDescription: 'Not configurable.',
    rationale:
      'All files of public packages should have the license banner at the top of the file.',
    ruleName: 'dt-require-license-banner',
    type: 'maintainability',
    typescriptOnly: true,
  };

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new RequireLicenseBannerWalker(sourceFile, this.getOptions()),
    );
  }
}

class RequireLicenseBannerWalker extends Lint.RuleWalker {
  visitSourceFile(sourceFile: ts.SourceFile): void {
    const fileContent = sourceFile.getFullText();
    const licenseCommentPos = fileContent.indexOf(licenseBanner);

    if (licenseCommentPos !== 0) {
      return this.addFailureAt(0, 0, ERROR_MESSAGE, tslintFix);
    }

    super.visitSourceFile(sourceFile);
  }
}
