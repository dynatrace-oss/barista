import { join } from 'path';

export interface BuildConfig {
  /** Path to the root of the project. */
  projectDir: string;
  /** Path to the directory where the output will be stored. */
  outputDir: string;
  /** Path to the directory where the library build will be stored */
  libOutputDir: string;
  /** Path to the directory for the library */
  libDir: string;
  /** Path where the UI Test app is stored */
  uiTestAppDir: string;
  /** Path where the output of the UI Test app is stored */
  uiTestAppOutputDir: string;
  /** Path where the universal is stored */
  universalAppDir: string;
  /** Path where the output of the universal app is stored */
  universalAppOutputDir: string;
}

const projectRoot = join(__dirname, '../..');

export const buildConfig: BuildConfig = {
  /** Path to the library */
  libDir: join(projectRoot, 'src', 'lib'),
  /** Path to the directory where the output will be stored. */
  outputDir: join(projectRoot, 'dist'),
  /** Path to the directory where the library build will be stored */
  libOutputDir: join(projectRoot, 'dist', 'lib'),
  /** Path to the root of the project. */
  projectDir: projectRoot,
  /** Path where the UI Test app is stored */
  uiTestAppDir: join(projectRoot, 'src', 'ui-test-app'),
  /** Path where the output of the UI Test app is stored */
  uiTestAppOutputDir: join(projectRoot, 'dist', 'ui-test-app'),
  /** Path where the universal is stored */
  universalAppDir: join(projectRoot, 'src', 'universal-app'),
  /** Path where the output of the universal app is stored */
  universalAppOutputDir: join(projectRoot, 'dist', 'universal-app'),
} ;
