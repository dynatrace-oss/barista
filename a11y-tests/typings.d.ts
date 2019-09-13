/** Extends Jasmine namespace with my own Matcher */
declare namespace jasmine {
  interface Matchers<T> {
    toBeValid(): boolean;
  }
}
