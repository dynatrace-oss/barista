import {platformBrowser} from '@angular/platform-browser';
import {UiTestAppModuleNgFactory} from './ui-test-app-module.ngfactory';
import {enableProdMode} from '@angular/core';

enableProdMode();

platformBrowser().bootstrapModuleFactory(UiTestAppModuleNgFactory);
