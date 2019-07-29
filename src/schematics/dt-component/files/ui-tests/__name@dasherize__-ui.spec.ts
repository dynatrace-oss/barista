import { browser } from 'protractor';

describe('<%= classify(name) %>', () => {
  beforeEach(async () => browser.get('/<%= dasherize(name) %>'));
});
