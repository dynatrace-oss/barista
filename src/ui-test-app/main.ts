import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { UiTestAppModule } from './ui-test-app-module';
// import { enableProdMode } from '@angular/core';

// tslint:disable-next-line:no-floating-promises
platformBrowserDynamic().bootstrapModule(UiTestAppModule);
