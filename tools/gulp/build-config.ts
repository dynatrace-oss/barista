import { join } from 'path';

export interface BuildConfig {
  /* Path to the root of the project. */
  projectDir: string;
  /* Path to the directory where the output will be stored. */
  outputDir: string;
  /* Path to the directory where the library build will be stored */
  libOutputDir: string;
  /* Path to the directory for the library */
  libDir: string;
  /* Path to the directory where the build for the library will run
   this is necessary because we need to remove the module.id during the build to have it working with aot */
  libPackageDir: string;
  /* Path to the dist dir for unit tests */
  unitTestOutputDir: string;
  /* Path where the UI Test app is stored */
  uiTestAppDir: string;
  /* Path where the output of the UI Test app is stored */
  uiTestAppOutputDir: string;
  /* Path where the universal is stored */
  universalAppDir: string;
  /* Path where the output of the universal app is stored */
  universalAppOutputDir: string;
  /* Version for angular peer dependencies */
  angularVersion: string;
  /* Path to the barista examples */
  examplesDir: string;
  /* Path to the barista examples output dir */
  examplesOutputDir: string;
}

const projectRoot = join(__dirname, '../..');

export const buildConfig: BuildConfig = {
  /* Path to the library */
  libDir: join(projectRoot, 'src', 'lib'),
  /* Path to the library package dir */
  libPackageDir: join(projectRoot, 'dist', 'lib-temp'),
  /* Path to the directory where the output will be stored. */
  outputDir: join(projectRoot, 'dist'),
  /* Path to the directory where the library build will be stored */
  libOutputDir: join(projectRoot, 'dist', 'lib'),
  /* Path to the root of the project. */
  projectDir: projectRoot,
  /* Path to the unit test dist folder */
  unitTestOutputDir: join(projectRoot, 'dist', 'unit-test'),
  /* Path where the UI Test app is stored */
  uiTestAppDir: join(projectRoot, 'src', 'ui-test-app'),
  /* Path where the output of the UI Test app is stored */
  uiTestAppOutputDir: join(projectRoot, 'dist', 'ui-test-app'),
  /* Path where the universal is stored */
  universalAppDir: join(projectRoot, 'src', 'universal-app'),
  /* Path where the output of the universal app is stored */
  universalAppOutputDir: join(projectRoot, 'dist', 'universal-app'),
  /* Path to the barista examples */
  examplesDir: join(projectRoot, 'src', 'barista-examples'),
  /* Path to the barista examples output dir */
  examplesOutputDir: join(projectRoot, 'dist', 'barista-examples'),
  /* Angular Version that is required for the library.
   * This will be used as the version for the angular peer dependencies */
  angularVersion: '^7.0.0',
} ;
