import {
  inputLeaf,
  inputWater,
  isRadioChecked,
  isRadioDisabled,
  radioLeaf,
  radioWater,
  toggleDisable,
} from './radio.po';

// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

fixture('Radio').page('http://localhost:4200/radio');

test('should be checked when clicked', async (testController: TestController) => {
  await testController.click(radioWater);
  await testController.expect(await isRadioChecked(radioWater)).ok();
  await testController.expect(await inputWater.checked).ok();
  await testController.expect(await inputLeaf.checked).notOk();

  await testController.click(radioLeaf);
  await testController.expect(await isRadioChecked(radioLeaf)).ok();
  await testController.expect(await inputWater.checked).notOk();
  await testController.expect(await inputLeaf.checked).ok();
});

test('should be disabled when disable the radio group', async (testController: TestController) => {
  await toggleDisable();
  await testController.expect(await isRadioDisabled(radioWater)).ok();
  await testController.expect(await inputWater.hasAttribute('disabled')).ok();

  await testController.click(radioWater);
  await testController.expect(await inputWater.checked).notOk();

  await testController.expect(await isRadioDisabled(radioLeaf)).ok();
  await testController.expect(await inputLeaf.hasAttribute('disabled')).ok();

  await testController.click(radioLeaf);
  await testController.expect(await inputLeaf.checked).notOk();
});
