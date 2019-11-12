// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { checkbox, input } from './checkbox.po';

fixture('Checkbox').page('http://localhost:4200/checkbox');

test('should be checked when clicked, and unchecked when clicked again', async (testController: TestController) => {
  await testController.click(checkbox);
  await testController.expect(await input.checked).ok();
  await testController.click(checkbox);
  await testController.expect(await input.checked).notOk();
});

test('should toggle the checkbox when pressing space', async (testController: TestController) => {
  await testController.expect(await input.checked).notOk();

  await testController.pressKey('tab');
  await testController.pressKey('space');

  await testController.expect(await input.checked).ok();
});
