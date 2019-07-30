# Coding Standards

## General

## Typescript

### Naming

- Prefer writing out words instead of using abbreviations.
- Except for `@Input` properties, use `is` and `has` prefixes for boolean
  properties / methods.

### Classes

- Classes should be named based on what they're responsible for. Names should
  capture what the code does, not how it is used.
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

#### Getters and Setters

- Getters and Setters should only be used when additional logic is required
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

### RxJS

- Suffix all public, internal, private and local Observables with `$`.
- Omit the `$` suffix for `@Output` streams.
- Suffix subscriptions with `Subscription`
- Make sure to always unsubscribe from observables (either by using `async`
  pipes, by calling unsubscribe or by using the "destroy subject pattern").

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

### Classnames

- Prefix all classnames with `dt-` to avoid collisions and identify styling
  classes as part of the component library.
- Use descriptive classnames that define what the element / style should
  represent rather than what it looks like:  
  Good: `dt-tag`  
  Bad: `dt-gray-tag`
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
