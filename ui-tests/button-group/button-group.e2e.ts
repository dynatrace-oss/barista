// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  groupItem,
  isDisabled,
  isSelected,
  labelText,
} from './button-group.po';

fixture('Button Group').page('http://localhost:4200/button-group');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(groupItem(1));
  await testController.expect(await labelText(1)).match(/Value 1/);

  await testController.click(groupItem(0));
  await testController.expect(await labelText(1)).match(/Value 0/);
});

test('should have styles', async (testController: TestController) => {
  await testController.click(groupItem(0));
  await testController.expect(await isSelected(groupItem(0))).ok();
  await testController.expect(await isSelected(groupItem(1))).notOk();

  await testController.click(groupItem(1));
  await testController.expect(await isSelected(groupItem(0))).notOk();
  await testController.expect(await isSelected(groupItem(1))).ok();
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController.expect(await isDisabled(groupItem(1, 2))).ok();
  await testController.expect(await labelText(2)).eql('');
});

test('should not execute click handlers when item disabled', async (testController: TestController) => {
  await testController.expect(await isDisabled(groupItem(1, 3))).ok();
  await testController.expect(await labelText(3)).eql('Value 0');
});
