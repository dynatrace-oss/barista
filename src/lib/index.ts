/*
 * The exports need to end with the filename without .ts extension due to
 * a bug in the compiler cli metadata bundler https://github.com/angular/angular/pull/22856
 * once resolved the index can be omited. Without this the metdata files only contain the last
 * barrel export and therefore break aot compilation with the library
 * export * from './core/index';
 */

export * from './alert/index';
export * from './core/index';
export * from './form-field/index';
export * from './input/index';
export * from './expandable-panel/index';
export * from './inline-editor/index';
export * from './expandable-section/index';
export * from './button-group/index';
export * from './button/index';
export * from './icon/index';
export * from './loading-distractor/index';
export * from './theming/index';
export * from './table/index';
export * from './chart/index';
export * from './button/index';
export * from './tile/index';
export * from './card/index';
export * from './context-dialog/index';
export * from './tag/index';
export * from './show-more/index';
