# Coding Standards

Beside Dynatrace specific guidelines the following coding standards are also
heavily inspired by the
[Angular Material Coding Standards](https://github.com/angular/components/blob/master/CODING_STANDARDS.md)
and the
[Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
which give us a solid foundation for our component library.

## General

### Comments

- Write useful comments
- Comments that explain what some block of code does are nice. They can tell you
  something in less time than it would take to follow through the code itself.
- Comments that explain why some block of code exists at all, or does something
  the way it does, are invaluable. The "why" is difficult, or sometimes
  impossible, to track down without seeking out the original author.
- In TypeScript code, use JsDoc-style comments for descriptions (on classes,
  members, etc.) and use `//` style comments for everything else (explanations,
  background info, etc.).
- In SCSS code, always use `//` style comments.

### Granularity

- Prefer more focused, granular components vs. complex, configurable components.
- Prefer small, focused modules.
- Keeping modules to a single responsibility makes the code easier to test,
  consume, and maintain. Ideally, individual files are 200 - 300 lines of code.
- As a rule of thumb, once a file draws near 400 lines (barring abnormally long
  constants / comments), start considering how to refactor into smaller pieces.

## API Design

- Once a feature is released, it never goes away. We should avoid adding
  features that don't offer high user value for price we pay both in
  maintenance, complexity, and payload size. When in doubt, leave it out.
- This applies especially to providing two different APIs to accomplish the same
  thing. Always prefer sticking to a single API for accomplishing something.
- Avoid adding boolean arguments to a method in cases where that argument means
  "do something extra". In these cases, prefer breaking the behavior up into
  different functions.

Bad:

```ts
function getTargetElement(createIfNotFound = false) {
  // ...
}
```

Good:

```ts
function getExistingTargetElement() {
  // ...
}

function createTargetElement() {
  // ...
}
```

## Typescript

### Naming

- Prefer writing out words instead of using abbreviations.
- Except for `@Input` properties, use `is` and `has` prefixes for boolean
  properties / methods.

### Local Variables

- Declare all local variables with either `const` or `let`. Use `const` by
  default, unless a variable needs to be reassigned.
- The `var` keyword must not be used.
- Every local variable declaration declares only one variable: declarations such
  as `let a = 1, b = 2;` are not used.
- Local variables are not always declared at the start of their containing block
  or block-like construct. Instead, local variables can also be declared close
  to the point they are first used (within reason), to minimize their scope.

### Arrays

- Do not use the Array constructor. The constructor is error-prone if arguments
  are added or removed. Use a literal instead.

Bad:

```ts
const a1 = new Array(x1, x2, x3);
```

Good:

```ts
const a1 = [x1, x2, x3];
```

- Explicitly allocating an array of a given length using `new Array(length)` is
  allowed when appropriate.
- Do not define or use non-numeric properties on an array (other than length).
  Use a `Map` (or `Object`) instead.

#### Destructuring

- Array literals may be used on the left-hand side of an assignment to perform
  destructuring. A final rest element may be included.

```ts
const [a, b, c, ...rest] = generateResults();
```

- Not used elements should be omitted when performing a destructuring.

```ts
let [, b, , d] = someArray;
```

#### Spread operator

- Array literals may include the spread operator (`...`) to flatten elements out
  of one or more other iterables.
- The spread operator should be used instead of more awkward constructs with
  Array.prototype.

```ts
[...foo]   // preferred over Array.prototype.slice.call(foo)
[...foo, ...bar]   // preferred over foo.concat(bar)
```

### Objects

- Do not use the Object constructor. Use an object literal (`{}` or
  `{ a: 0, b: 1, c: 2 }`) instead.
- Do not mix quoted and unquoted keys. Object literals may represent either
  _structs_ (with unquoted keys and/or symbols) or _dicts_ (with quoted and/or
  computed keys).
- For dicts consider using `Map` instead.
- Avoid using methods in objects if possible. Consider using [Classes](#classes)
  instead.
- Shorthand properties are allowed on object literals.

#### Destructuring

- Object destructuring patterns may be used on the left-hand side of an
  assignment to perform destructuring and unpack multiple values from a single
  object.
- Destructured objects may also be used as function parameters, but should be
  kept as simple as possible: a single level of unquoted shorthand properties.
- Deeper levels of nesting and computed properties may not be used in parameter
  destructuring.
- Specify any default values in the left-hand-side of the destructured parameter
  (`{str = 'some default'} = {}`, rather than `{str} = {str: 'some default'}`)

Example:

```ts
function destructured(ordinary, { num, str = 'some default' } = {});
```

### Enums

- Additional properties may not be added to an enum after it is defined.
- All enum values must be deeply immutable.
- Prefer `const` enums for improved compile output.

Discouraged:

```ts
enum OptionType {
  Option1,
  Option2,
}
```

Preferred:

```ts
const enum OptionType {
  Option1,
  Option2,
}
```

### Classes

- Classes should be named based on what they're responsible for. Names should
  capture what the code does, not how it is used.
- Each class should have a single responsibility. Avoid God-Objects.
- Avoid suffixing a class with "Service" or "Component", as it communicates
  nothing about what the class does.
- Prefix consumer facing classes with `Dt` (e.g. `DtButton`).

#### Methods

- The name of a method should capture the action that is performed by that
  method rather than describing when the method will be called.
- When naming generic method used just for handling events use the pattern
  `handle<EventName>` (e.g. `handleMouseMove`). Avoid the `on` prefix.

#### Access modifiers

- Omit the `public` keyword as it is the default behavior.
- Use `private` when appropriate and possible, prefixing the name with an
  underscore.
- Use `protected` when appropriate and possible with no prefix.
- Prefix _library-internal_ properties and methods with an underscore without
  using the `private` keyword and apply the `@internal` annotation. This is
  necessary for anything that must be public (to be used by Angular), but should
  not be part of the consumer-facing API. This typically applies to symbols used
  in template expressions, `@ViewChildren` / `@ContentChildren` properties, host
  bindings, and `@Input` / `@Output` properties (when using an alias).

#### Getters and setters

- Getters and setters should only be used when additional logic is required
  despite setting/getting a property. For example the call of a coercion
  function.
- Avoid long or complex getters and setters. Introduce a new method to contain
  the logic if the logic of the accessor would take to many lines.
- A getter should immediately precede its corresponding setter (getter before
  the setter).
- Decorators such as `@Input` should be applied to the getter and not the
  setter.
- Always use a `readonly` property instead of a getter (with no setter) when
  possible (no additional logic).

#### Inheritance

Avoid using inheritance to apply reusable behaviors to multiple components. This
limits how many behaviors can be composed. Instead, TypeScript mixins can be
used to compose multiple common behaviors into a single component.

#### Static

- Avoid using static only classes. There are better ways in JavaScript (like
  using a plain object or exporting constants directly).
- Use static properties/methods with care. Try to use top-level (pure) functions
  or constants if possible. This makes it also easier to control who can use it.

### Arrow functions

- Arrow functions provide a concise syntax and fix a number of difficulties with
  `this`. Prefer arrow functions over the `function` keyword, particularly for
  nested functions.
- Avoid assigning arrow functions to top-level constants when possible. For
  top-level functions the `function` keyword is preferred.
- Prefer using arrow functions over `fn.bind(this)`
- Avoid writing `const self = this`. Arrow functions are particularly useful for
  callbacks, which sometimes pass unexpected additional arguments.

### Spread operator

Prefer the spread operator to `Function.prototype.apply` when an array or
iterable is unpacked into multiple parameters of a variadic function.

### String literals

- Ordinary string literals are delimited with single quotes (`'`), rather than
  double quotes (`"`). Ordinary string literals may not span multiple lines.
- Use template strings (delimited with `\``) over complex string concatenation,
  particularly if multiple string literals are involved. Template strings may
  span multiple lines.
- If a template string spans multiple lines, it does not need to follow the
  indentation of the enclosing block, though it may if the added whitespace does
  not matter.
- If indentation is preferred concatenate lines using the `+` operator.

```ts
const text =
  'It is a long established fact that a reader' +
  'will be distracted by the readable content of a page when' +
  'looking at its layout.';
```

- Do not use line continuations (that is, ending a line inside a string literal
  with a backslash) in either ordinary or template string literals. Even though
  ES5 allows this, it can lead to tricky errors if any trailing whitespace comes
  after the slash, and is less obvious to readers.

Bad:

```ts
const text =
  'It is a long established fact that a reader \
  will be distracted by the readable content of a page when \
  looking at its layout.';
```

Good:

```ts
const text =
  'It is a long established fact that a reader' +
  'will be distracted by the readable content of a page when' +
  'looking at its layout.';
```

### Control structures

- `for-of` loops should be preferred when possible.
- Avoid using `[].forEach`. Use `for-of` instead.
- `for-in` loops may only be used on dict-style objects and should not be used
  to iterate over an array.
- `Object.prototype.hasOwnProperty` should be used in for-in loops to exclude
  unwanted prototype properties.
- Prefer `for-of` and `Object.keys` over `for-in` when possible.
- Each `switch` statement should include a default statement group, even if it
  contains no code.
- Only use `this` in class constructors and methods, or in arrow functions
  defined within class constructors and methods.
- Never use `this` to refer to the global object, the context of an `eval`, the
  target of an event, or unnecessarily `call()`ed or `apply()`ed functions.

#### Try-Catch

Avoid `try-catch` blocks, instead preferring to prevent an error from being
thrown in the first place. When impossible to avoid, the `try-catch` block must
include a comment that explains the specific error being caught and why it
cannot be prevented.

### RxJS

- Suffix all public, internal, private and local Observables with `$`.
- Omit the `$` suffix for `@Output` streams.
- Suffix subscriptions with `Subscription`
- Make sure to always unsubscribe from observables (either by using `async`
  pipes, by calling unsubscribe or by using the "destroy subject pattern").

### Disallowed features

- Do not use the `with` keyword. It makes your code harder to understand and has
  been banned in strict mode since ES5.
- Do not use `eval` or the `Function(...string)` constructor. These features are
  potentially dangerous!
- Do not use non-standard features. This includes old features that have been
  removed (e.g., `WeakMap.clear`), new features that are not yet standardized,
  or proprietary features that are only implemented in some browsers.
- Never use `new` on the primitive object wrappers (`Boolean`, `Number`,
  `String`, `Symbol`), nor include them in type annotations.
- Never modify builtin types, either by adding methods to their constructors or
  to their prototypes. Avoid depending on libraries that do this.
- Do not add symbols to the global object unless absolutely necessary.

## HTML

- Avoid unnecessary complexity in your templates.
- Avoid inline styles within templates. Add CSS classes to elements and add
  styling information to (S)CSS files.

### Semantics

- Use tags in a semantically correct way, e.g. a `<button>` element instead of a
  `<span>` for a part of the component that triggers some action.
- Use HTML5 tags with semantic meaning (e.g. `<nav>`, `<figure>`,) instead of
  `<div>` or `<span>` when appropriate.
- Don't use headline tags (`h1` - `h6`) within component templates as you can't
  know where the component is actually used and what heading level would fit
  best. If you want to indicate something as headline, use `role="heading"` and
  let the consumer of the component set the `aria-level` via an `@Input`
  property.

### Accessibility

Add appropriate ARIA attributes to elements to support assistive technologies in
understanding the HTML structure and content without having any visual
representation thereof.

## CSS & SCSS

- Prefer styling via class selectors / attribute selectors over id selectors.
- Avoid styling Angular specific attributes like `ng-reflect` or `nghost`.

### Classnames

- Prefix all classnames with `dt-<component-name>` (i.e. `dt-button-label`) to
  avoid collisions and identify styling classes as part of the component
  library.
- Use descriptive classnames that define what the element / style should
  represent rather than what it looks like. Avoid using colors or specific
  representational names in class names: Good: `dt-tag`, `dt-tag-label`,
  `dt-tag-action`  
  Bad: `dt-tag-gray`, `dt-tag-rounded-corners`, `dt-tag-margin-top-4`
- We do not follow a specific BEM or other naming convention.

### SCSS specifics

- Avoid using scss class nesting if it is not immediately required for
  specificity. Sass nesting does not necessarily need to follow html structure.

```html
<div class="dt-tag">
  <span class="dt-tag-label">Label</span>
  <button class="dt-tag-action">X</button>
</div>
```

Good:

```scss
.dt-tag {
  background-color: $gray-400;
}

.dt-tag-label {
  font-size: 14px;
}
```

Bad:

```scss
.dt-tag {
  background-color: $gray-400;

  .dt-tag-label {
    font-size: 14px;
  }
}
```

- Do not use `@extend` as it modfies the original instance, which bloats the
  selectors and the resulting files.
- Do not use `&` to concatenate selector-names, this will make it almost
  impossible to find the class `dt-tag-label` in the source code.

Bad:

```scss
.dt-tag {
  background-color: $gray-400;

  &-label {
    font-size: 14px;
  }
}
```
