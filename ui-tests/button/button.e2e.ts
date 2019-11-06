import { Selector } from 'testcafe';

// import { browser, by, element } from 'protractor';

// test('button', () => {
//   describe('disabling behavior', () => {
//     beforeEach(async () => browser.get('/button'));

//     it('should execute click handlers when not disabled', async () => {
//       element(by.id('test-button')).click();
//       expect(await element(by.id('click-counter')).getText()).toEqual('1');
//     });

//     it('should not execute click handlers when disabled', async () => {
//       element(by.id('disable-toggle')).click();
//       expect(
//         await element(by.id('test-button')).getAttribute('disabled'),
//       ).toBeTruthy();
//       element(by.id('test-button')).click();
//       expect(await element(by.id('click-counter')).getText()).toEqual('0');
//     });
//   });
// });
fixture('Button').page('http://localhost:4200/button');

const button = Selector('#test-button');
const clickCounter = Selector('#click-counter');

test('should execute click handlers when not disabled', async (testController: TestController) => {
  await testController.click(button);

  const count = await clickCounter.textContent;
  await testController.expect(count).eql('1');
});
