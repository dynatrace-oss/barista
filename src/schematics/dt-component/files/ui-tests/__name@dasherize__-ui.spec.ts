import {browser, by, element, ExpectedConditions } from 'protractor';

describe('<%=classify(name)%>', () => {
  beforeEach(() => browser.get('/<%=dasherize(name)%>'));

});
