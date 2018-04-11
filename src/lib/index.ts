/*
 * The exports need to end with the filename without .ts extension due to
 * a bug in the compiler cli metadata bundler https://github.com/angular/angular/pull/22856
 * once resolved the index can be omited. Without this the metdata files only contain the last
 * barrel export and therefore break aot compilation with the library
 * export * from './core/index';
 */

export * from './core/index';
export * from './button/index';
export * from './button-toggle/index';
export * from './theming/index';
