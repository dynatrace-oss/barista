import * as fs from 'fs';
import { join, basename, relative, dirname } from 'path';
import * as ts from 'typescript';
import { strings } from '@angular-devkit/core';
import { sync as glob } from 'glob';
import { task, src, dest, series } from 'gulp';
import { buildConfig } from '../build-config';
import { replaceInFile } from '../util/file-replacer';
import * as through from 'through2';
import { execNodeTask } from '../util/task-runner';

const ARGS_TO_OMIT = 3;
const DEPLOY_URL_ARG = 'deploy-url';

const projectRoot = join(__dirname, '../../..');
const environmentsDir = join(projectRoot, 'src', 'barista-examples', 'environments');
const args = process.argv.splice(ARGS_TO_OMIT);

const getDeployUrl = () => {
  const deployUrlArg = args.find((arg) => arg.startsWith(`--${DEPLOY_URL_ARG}=`));

  if (!deployUrlArg) {
    return undefined;
  }

  // tslint:disable-next-line no-magic-numbers
  const [, deployUrl] = deployUrlArg.split('=', 2);
  return deployUrl;
};

const { examplesDir, libDir } = buildConfig;

interface ExampleMetadata {
  component: string;
  sourcePath: string;
}

interface InvalidExampleReferences {
  name: string;
  sourcePath: string;
}

interface AppComponentRouteSetup {
  name: string;
  examples: Array<{ name: string; route: string; className: string, import: string }>;
}

/** Parses the examples and collects all data */
function getExampleMetadata(sourceFiles: string[]): ExampleMetadata[] {
  const parsedData: Set<ExampleMetadata> = new Set();
  sourceFiles.forEach((sourceFilePath) => {
    const content = fs.readFileSync(sourceFilePath, { encoding: 'utf-8' });
    const fileName = basename(sourceFilePath);
    const components = retrieveExampleClassNames(fileName, content);
    components.forEach((component) => {
      const metadata: ExampleMetadata = {
        component,
        sourcePath: relative(examplesDir, sourceFilePath),
      };
      parsedData.add(metadata);
    })
  });
  return [...parsedData];
}

/** Parse the AST of the given source file and collects Angular component metadata. */
export function retrieveExampleClassNames(fileName: string, content: string): string[] {
  const sourceFile = ts.createSourceFile(fileName, content, ts.ScriptTarget.Latest, false);
  const componentClassNames: string[] = [];
  // tslint:disable-next-line:no-any
  const visitNode = (node: any): void => {
    if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      if (node.decorators && node.decorators.length) {
        for (const decorator of node.decorators) {
          if (decorator.expression.expression.text === 'Component') {
            componentClassNames.push(node.name.text);
          }
        }
      }
    }

    ts.forEachChild(node, visitNode);
  };

  visitNode(sourceFile);
  return componentClassNames;
}

/** Build ES module import statements for the given example metadata. */
function buildImportsTemplate(data: ExampleMetadata): string {
  const relativeSrcPath = data.sourcePath.replace(/\\/g, '/').replace('.ts', '');

  return `import { ${data.component} } from './${relativeSrcPath}';`;
}

/**
 * Generates the app module from the given source files and writes it to a specified output
 * file.
 */
function generateAppModule(parsedData: ExampleMetadata[], outputFile: string, baseDir: string): void {
  const generatedModuleFile = populateAppModuleTemplate([...parsedData]);
  const generatedFilePath = join(baseDir, outputFile);
  if (!fs.existsSync(dirname(generatedFilePath))) {
    fs.mkdirSync(dirname(generatedFilePath));
  }
  fs.writeFileSync(generatedFilePath, generatedModuleFile);
}

/** Inlines the app module template with the specified parsed data. */
function populateAppModuleTemplate(parsedData: ExampleMetadata[]): string {
  const exampleImports = parsedData.map((m) => buildImportsTemplate(m)).join('\n');
  const exampleList = parsedData.map((m) => m.component);

  return fs.readFileSync(join(examplesDir, './app.module.template'), 'utf8')
    .replace('${imports}', exampleImports)
    .replace('${examples}', `[\n  ${exampleList.join(',\n  ')},\n]`);
}

/** Generates the meta information for each route */
function generateRouteMetadata(parsedData: ExampleMetadata[]): AppComponentRouteSetup[] {
  return parsedData.reduce((aggr: AppComponentRouteSetup[], val) => {
    const componentName = dirname(val.sourcePath);
    let index = aggr.findIndex((item) => item.name === componentName);
    if (index === -1) {
      index = aggr.push({ name: componentName, examples: [] }) - 1;
    }
    const dasherized = strings.dasherize(val.component);
    aggr[index].examples.push(
      {
        name: dasherized,
        route: `${componentName}/${dasherized}`,
        className: val.component,
        import: buildImportsTemplate(val),
      }
    );
    return aggr;
  }, [])
}

/** Generates the imports for each example file */
function generateImportsForExamples(content: string, routeMetadata: AppComponentRouteSetup[]): string {
  let imports = '';
  routeMetadata.forEach((metadata) => {
    metadata.examples.forEach((example) => {
      imports = `${imports}\n${example.import}`;
    });
  });
  return content.replace('${imports}', imports);
}

/** Generates the nav items list used to render the sidebar */
function generateNavItems(content: string, routeMetadata: AppComponentRouteSetup[]): string {
  const navItems = routeMetadata.map((metadata) => {
    const exampleData = metadata.examples.map((example) => ({ name: example.name, route: example.route }));
    return { name: metadata.name, examples: exampleData };
  });
  return content.replace('${navItems}', JSON.stringify(navItems, null, '\t'));
}

/** Generates the route definitions */
function generateRoutes(content: string, routeMetadata: AppComponentRouteSetup[]): string {
  let routeString = '';
  routeMetadata.forEach((metadata: AppComponentRouteSetup) => {
    metadata.examples.forEach((example) => {
      routeString = `${routeString}
      { path: '${example.route}', component: ${example.className}},`;
    });
  });
  if (routeString.endsWith(',')) {
    routeString = routeString.slice(0, -1);
  }
  return content.replace('${routes}', `[${routeString}]`);
}

/** Generates the app component */
function generateAppComponent(parsedData: ExampleMetadata[]): void {
  const routeMetadata = generateRouteMetadata(parsedData);
  let content = fs.readFileSync(join(examplesDir, 'app.component.template'), { encoding: 'utf8' });
  content = generateImportsForExamples(content, routeMetadata);
  content = generateNavItems(content, routeMetadata);
  content = generateRoutes(content, routeMetadata);
  fs.writeFileSync(join(examplesDir, 'app.component.ts'), content, { encoding: 'utf8' });
}

/** Checks the content of given source files for invalid example names and returns them. */
function getInvalidExampleReferences(sourceFiles: string[], exampleNames: string[]): InvalidExampleReferences[] {
  const invalidRefs: InvalidExampleReferences[] = [];
  sourceFiles.forEach((sourceFilePath) => {
    const content = fs.readFileSync(sourceFilePath, { encoding: 'utf-8' });
    const regex = /<docs-source-example example=\"(.+?)\"(.*?)><\/docs-source-example>/g;
    let matches;
    // tslint:disable-next-line no-conditional-assignment
    while ((matches = regex.exec(content)) !== null) {
      if (!exampleNames.includes(matches[1])) {
        const exampleRef = {
          name: matches[1],
          sourcePath: sourceFilePath,
        };
        invalidRefs.push(exampleRef);
      }
    }
  });
  return invalidRefs;
}

/** Validates Barista example names used in lib readme files. */
task('barista-examples:validate', (done) => {
  const exampleNames = getExampleMetadata(glob(join(examplesDir, '*/*.ts')))
    .map((metadata) => metadata.component);
  const invalidExampleRefs = getInvalidExampleReferences(glob(join(libDir, '**/README.md')), exampleNames);
  if (invalidExampleRefs.length > 0) {
    const errors = invalidExampleRefs.map((ref) => `Invalid example name "${ref.name}" found in ${ref.sourcePath}.`);
    const errorMsg = errors.join('\n');
    done(errorMsg);
    return;
  }
  done();
});

/** Creates the examples module */
task('barista-example:generate', (done) => {
  const metadata = getExampleMetadata(glob(join(examplesDir, '*/*.ts')));
  generateAppModule(metadata, 'app.module.ts', examplesDir);
  generateAppComponent(metadata);
  done();
});

/** Sets the deployUrl depending on the environment */
task('barista-examples:set-env', () => {
  const deployUrl = getDeployUrl();
  return src(join(environmentsDir, 'environment.ts'))
    .pipe(deployUrl ? replaceInFile(/deployUrl:[^,]+,/gm, `deployUrl: '${deployUrl}',`) : through.obj())
    .pipe(dest(environmentsDir));
});

task('barista-examples:compile', execNodeTask('@angular/cli', 'ng', ['build', 'barista-examples', ...args]));

/** Combines both tasks the set env and the build tasks */
task('barista-examples:build', series(
  'barista-examples:validate',
  'barista-examples:set-env',
  'barista-example:generate',
  'barista-examples:compile'
));
