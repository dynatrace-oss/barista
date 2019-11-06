// tslint:disable no-lifecycle-call no-use-before-declare no-magic-numbers
// tslint:disable no-any max-file-line-count no-unbound-method use-component-selector

import { consumption, dummyContent, mouseoutArea } from './consumption.po';

fixture('Consumption').page('http://localhost:4200/consumption');

test('should show an overlay containing custom content while hovering and hide it when the mouse leaves the element', async (testController: TestController) => {
  await testController.hover(consumption);
  await testController.expect(await dummyContent.exists).ok();

  await testController.hover(mouseoutArea);
  await testController.expect(await dummyContent.exists).notOk();
});
