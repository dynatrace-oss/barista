import { JsonObject } from '@angular-devkit/core';

export interface BaristaBuildBuilderSchema extends JsonObject {
  /** The universal serve-ssr target that should be started. */
  devServerTarget: string;
  /** The output path of the generated files. */
  outputPath: string;
  /** Path to the file that holds the route information.  */
  routesFile: string;
}
