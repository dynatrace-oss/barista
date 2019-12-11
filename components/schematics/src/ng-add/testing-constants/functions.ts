import { Tree } from '@angular-devkit/schematics/src/tree/interface';

export function createPackageTree(tree: Tree): void {
  tree.create(
    '/package.json',
    JSON.stringify(
      {
        dependencies: {
          '@dynatrace/angular-components': '4.14.0',
        },
      },
      null,
      2,
    ),
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
  imports: [ BrowserModule, testModule ],
  exports: [ testModule ]
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
