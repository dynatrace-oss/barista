// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { clickOption, errorBox, input } from './filter-field.po';

fixture('Filter Field').page('http://localhost:4200/filter-field');

test('should not show a error box if there is no validator provided', async (testController: TestController) => {
  await clickOption(1);
  await testController.typeText(input, 'abc');
  await testController.expect(await errorBox.exists).notOk();
});

test('should show a error box if does not meet the validation function', async (testController: TestController) => {
  await clickOption(3);
  await testController.typeText(input, 'a');
  await testController.expect(await errorBox.exists).ok();
  await testController
    .expect(await errorBox.innerText)
    .match(/min 3 characters/gm);
});

test('should show is required error when the input is dirty', async (testController: TestController) => {
  await clickOption(3);
  await testController.typeText(input, 'a');
  await testController.debug();
  await testController.pressKey('backspace');
  await testController.expect(await errorBox.exists).ok();
  await testController
    .expect(await errorBox.innerText)
    .match(/field is required/gm);
});

test('should hide the error box when the node was deleted', async (testController: TestController) => {
  await clickOption(3);
  await testController.pressKey('backspace').pressKey('backspace');
  await testController.expect(await errorBox.exists).notOk();
});
