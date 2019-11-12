import { button, clickCounter, disableButton } from './button.po';

fixture('Button').page('http://localhost:4200/button');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(button);

  const count = await clickCounter.textContent;
  await testController.expect(count).eql('1');
});

test('should not execute click handlers when disabled', async (testController: TestController) => {
  await testController.click(disableButton);

  await testController.expect(button.hasAttribute('disabled')).ok();

  await testController.click(button);
  await testController.expect(await clickCounter.textContent).eql('0');
});
