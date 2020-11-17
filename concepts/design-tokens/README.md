# Design tokens

> Design tokens are an agnostic way to store variables such as typography,
> color, and spacing so that your design system can be shared across platforms
> like iOS, Android, and regular ol' websites.

-- <cite>Robin Rendle "[What are design tokens]", CSS-Tricks</cite>

## What we want to achive with Design tokens

In the current state of the Barista components library, we do share some basic
color, typography and spacing definitions through scss mixins and variables
within the angular ecosystem. Which works very well for color definitions, did
not prove to be consistent for spacings and typography definitions. As our plans
for Barista do not only target Angular, but a more framework agnostic component
library, we are re-evaluating the way on how we deal with design tokens.

Extracted design tokens should enable us to be extremely consistent within the
system. With everything, that is relevant to the design-language baked into
tokens, we should be able to enforce usage of these tokens with linting rules
like [stylelint declaration strict value].

## Naming of design tokens

To prevent conflicts with css custom properties or other variables in output
files, we should prefix all our provided design tokens, mixins or exported
constants with a `dt-`/`dt` prefix.

## Structure

Tokens are usually stored in some sort of structural data (yml, json,
database,...). Which format we are ultimately choosing is still up for
discussion.

Just like the format, the file structure is also up for discussion. There are
multiple ways of structuring the design tokens into a folder structure, and a
conversion tool like [theo] will let you customize
[input and output formats quite easily](#output-and-formats).

Here are some variations of design tokens structure in the wild:

- [Salesforce design tokens]
- [Open table design tokens]
- [FirefoxUX design tokens]
- [Stu Robson SCL Tokens]

This is what we currently envision the structure of the design tokens to look
like:

```
aliases
 | border-radius.alias.yml
 | breakpoints.alias.yml
 | families.alias.yml
 | palette.alias.yml
 | typography.alias.yml

global
 | colors.yml
 | font-family.yml
 | spacing.yml

patterns/components
 | button.yml
 | card.yml
 | switch.yml

theme ?
```

### Aliases

Aliases should be considered variable definitions that assign a specific value
to a variable name. These variable definitions are not considered design tokens
yet, but they define values to be used within the global or pattern definitions.
Examples could look like this:

```yml
# aliases/spacing.alias.yml
aliases:
  spacing--0: 0
  spacing--xx-small: 2px
  spacing--x-small: 4px
  spacing--small: 8px
  spacing--medium: 16px
  spacing--large: 32px
```

### Global

Global tokens are considered very general declarations like spacing and colors
again. These mostly share their traits with the definitions from the aliases,
but can give some additional information about the usage of the token. These
tokens are available on a root level for the consuming project and will be used
further down the line by patterns / components portion of the structure.

```yml
# global/spacing.yml
imports:
  - '../aliases/spacing.alias.yml'

props:
  - name: dt-spacing--0
    value: '{!spacing--0}'
    comment: 'Zero spacing, use sparcely as it will make layouts very dense'
    meta:
      friendlyName: 'No spacing'

  - name: dt-spacing--xx-small
    value: '{!spacing--xx-small}'
    meta:
      friendlyName: 'Spacing, xx-small'

  - name: dt-spacing--x-small
    value: '{!spacing--x-small}'
    meta:
      friendlyName: 'Spacing, x-small'
# ...
```

### Patterns or Components

Pattern tokens are consuming tokens and declarations from the aliases and the
globals scope and define various design tokens for patterns / components like a
grid-layout or a button.

```yml
# patterns/button.yml
imports:
  - '../aliases/spacing.alias.yml'
  - '../aliases/palette.alias.yml'
props:
  # Base

  # Colours
  - name: dt-base-button-background-color
    value: '{!color-key-base}'
    comment: Base Colours
  - name: dt-base-button-border-color
    value: '{!color-key-lighter}'

  # Hover Styles
  - name: dt-base-button-background-color--hover
    value: '{!color-key-lighter}'

  # Primary

  - name: dt-primary-button-background-color
    value: '{!color-key-base}'
    comment: Primary Colours
  - name: dt-primary-button-background-color--hover
    value: '{!color-key-lighter}'

  - name: dt-primary-button-border-color
    value: '{!color-key--lighter}'
```

## Output and formats

Tools like [theo] can help us transform the yml/json definitions of our design
tokens into the output formats that we want to provide / consume with the design
system. Potential output formats that we should consider:

### CSS custom properites

CSS custom properties can be considered for everything that should be able to be
evaluated on the client or customized by the consumer. Options for this would
be:

- Button colors ([Weightless custom properties definition])
- Layout density
- Contrast mode / A11y mode changes

Potential output could look like this:

```css
/** custom-properties/button.css */
:root {
  --dt-base-button-background-color: #123456;
  --dt-base-button-background-color--hover: #123456;
  --dt-primary-button-background-color: #123456;
  --dt-primary-button-background-color--hover: #123456;
}
```

### Scss variables

Scss variables should be considered for everything that should be baked into the
design system and should not be customizable by the consumer. A healthy mix
between Scss variables and css custom properties is probably the best way to
target here.

Potential output could look like this:

```scss
/** scss-variables/button.scss*/
$dt-base-button-background-color: #123456;
$dt-base-button-background-color--hover: #123456;
$dt-primary-button-background-color: #123456;
$dt-primary-button-background-color--hover: #123456;

// But could also include
$dt-base-button-customizeable-example: var(--dt-base-button-background-color);
```

### Typescript constants

Sometimes it becomes necessary to use certain design tokens within component
logic. For some of these use cases, exported typescript constants for the design
tokens could help us keep things in sync between typescript and style.

Potential output could look like this:

```ts
/** ts-constants/button.ts*/
export const DT_BASE_BUTTON_BACKGROUND_COLOR = '#123456';
export const DT_BASE_BUTTON_BACKGROUND_COLOR_HOVER = '#123456';
export const DT_PRIMARY_BUTTON_BACKGROUND_COLOR = '#123456';
export const DT_PRIMARY_BUTTON_BACKGROUND_COLOR_HOVER = '#123456';
```

[what are design tokens]: https://css-tricks.com/what-are-design-tokens/
[theo]: https://github.com/salesforce-ux/theo
[stylelint declaration strict value]:
  https://github.com/AndyOGo/stylelint-declaration-strict-value
[stu robson scl tokens]:
  https://github.com/sturobson/SCL/tree/b22d4dfc6998a91c50d241ecc6ad379718571953/Design-Tokens
[salesforce design tokens]:
  https://github.com/salesforce-ux/design-system/tree/master/design-tokens
[open table design tokens]:
  https://github.com/opentable/design-tokens/tree/master/OTKit
[firefoxux design tokens]: https://github.com/FirefoxUX/design-tokens
[weightless custom properties definition]:
  https://github.com/andreasbm/weightless/blob/6c7965981752e85206d9da459110b2dddeecf9ec/src/lib/button/button.ts#L23-L46
