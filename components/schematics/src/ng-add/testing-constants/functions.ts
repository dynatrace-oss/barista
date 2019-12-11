/**
 * @license
 * Copyright 2019 Dynatrace LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Tree } from '@angular-devkit/schematics/src/tree/interface';

export function createPackageTree(tree: Tree): void {
  tree.create(
    '/package.json',
    `{
  "dependencies": {
    "@dynatrace/angular-components": "4.14.0"
  }
}`,
  );
}

export function createPeerDependenciesTree(tree: Tree): void {
  tree.create(
    'components/src/peerPackage.json',
    JSON.stringify({
      peerDependencies: {
        '@angular/cdk': '1.0.0',
      },
    }),
  );
}

export function createMultipleImportsTree(tree: Tree): void {
  tree.create(
    'apps/src/main.ts',
    `import { OnInit } from './path/to/file';
import { DtIconModule } from '@dynatrace/angular-components/icon';
import * as DtIcon from '@dynatrace/angular-components/icon';
import { DtIconModule } from '@dynatrace/angular-components';

const CONSTSANT = 'cno';

export interface MyInterface {

}

@Component({

})
export class MyComp implements OnInit {
  constructor(
    private _blabla: Bla
  ) {}
}
`,
  );
}

export function createAngularJsonTree(tree: Tree): void {
  tree.create(
    'angular.json',
    JSON.stringify({
      projects: {
        barista: {
          architect: {
            build: {
              options: {
                assets: [
                  {
                    glob: '**',
                    input: 'components/assets',
                    output: '/assets',
                  },
                  {
                    glob: '**/*',
                    input:
                      'node_modules/@dynatrace/angular-components/assets/fonts',
                    output: '/assets/fonts',
                  },
                ],
              },
            },
          },
        },
        e2e: {
          architect: {
            build: {
              options: {
                assets: [
                  {
                    glob: '**',
                    input: 'components/assets',
                    output: '/assets',
                  },
                  {
                    glob: '**/*',
                    input:
                      'node_modules/@dynatrace/angular-components/assets/fonts',
                    output: '/assets/fonts',
                  },
                ],
              },
            },
          },
        },
      },
    }),
  );
}

export function createAppModuleTree(tree: Tree): void {
  tree.create(
    'app.module.ts',
    `import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { testModule } from 'testModule';

@NgModule({
  imports: [
    BrowserModule,
    testModule
  ],
  exports: [testModule]
})
export class AppModule {

}
`,
  );
}

export function createStyleCssTree(tree: Tree): void {
  tree.create(
    'index.css',
    `body {
  background: red;
}

h1 {
  font-size: 120%;
}
`,
  );
}
