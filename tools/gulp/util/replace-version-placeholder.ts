import { readFileSync, writeFileSync } from 'fs';
import { buildConfig } from '../build-config';
import { join } from 'path';

const SPACES_FOR_PACKAGE_JSON = 2;

/** RegExp that matches Angular version placeholders within a file. */
const ngVersionPlaceholder = new RegExp('0.0.0-NG', 'g');
const ngCdkVersionPlaceholder = new RegExp('0.0.0-NG-CDK', 'g');

const readPackageJson = (dirPath: string) =>
  readFileSync(join(dirPath, 'package.json'), 'utf-8');

export const replaceVersionPlaceholders = () => {

  // read root package json in the projects root dir
  const rootPackageJson = readPackageJson(buildConfig.projectDir);
  // parse it as json
  const rootPackageJsonParsed = JSON.parse(rootPackageJson);

  let ngVersion = rootPackageJsonParsed.dependencies['@angular/core'];
  ngVersion = ngVersion.replace(/~|\^/, '');

  let ngCdkVersion = rootPackageJsonParsed.dependencies['@angular/cdk'];
  ngCdkVersion = ngCdkVersion.replace(/~|\^/, '');

  if (!ngVersion || !ngCdkVersion) {
    throw new Error('Version replacement failed. Could not find version of @angular/core or @angular/cdk in the root package.json');
  }

  // read the package json in the dist directory for the library
  // and replace the NG-version and NG-CDK placeholder
  let packageJson = readPackageJson(buildConfig.libOutputDir);
  packageJson = packageJson.replace(ngCdkVersionPlaceholder, ngCdkVersion);
  packageJson = packageJson.replace(ngVersionPlaceholder, ngVersion);

  // parse the package json and add the version from the root package json
  const parsed = JSON.parse(packageJson);
  parsed.version = rootPackageJsonParsed.version;

  // write file to the dist folder
  writeFileSync(join(buildConfig.libOutputDir, 'package.json'), JSON.stringify(parsed, null, SPACES_FOR_PACKAGE_JSON));
};
