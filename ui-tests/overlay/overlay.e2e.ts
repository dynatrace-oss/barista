// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import {
  disableButton,
  getActiveElementText,
  overlay,
  toggleDisable,
  trigger,
} from './overlay.po';

fixture('Overlay').page('http://localhost:4200/overlay');

test('should open the overlay when not disabled', async (testController: TestController) => {
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).ok();
});

test('should not open when disabled', async (testController: TestController) => {
  await toggleDisable();
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).notOk();
});

test('should open the overlay on mouseover and close on mouseout', async (testController: TestController) => {
  await testController.hover(trigger);
  await testController.expect(await overlay.exists).ok();
  await testController.hover(disableButton);
  await testController.expect(await overlay.exists).notOk();
});

test('should trap the focus inside the overlay', async (testController: TestController) => {
  await testController.click(trigger);
  await testController.expect(await overlay.exists).ok();

  await testController.expect(await getActiveElementText()).eql('Focus me');

  await testController.pressKey('tab');

  await testController
    .expect(await getActiveElementText())
    .eql('Focus me next');

  await testController.pressKey('tab');

  await testController.expect(await getActiveElementText()).eql('Focus me');
});
