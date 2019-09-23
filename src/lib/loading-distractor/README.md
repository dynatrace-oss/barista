---
title: 'Loading distractor'
description: 'The loading distractor indicates a saving or loading action.'
postid: loading-distractor
category: 'components'
public: true
contributors:
  dev:
    - thomas.pink
  ux:
    - andreas.mayr
tags:
  - 'loading'
  - 'spinner'
  - 'distractor'
  - 'angular'
  - 'component'
---

# Loading distractor & loading spinner

The `<dt-loading-spinner>` and `<dt-loading-distractor>` are circular indicators
of activity (e.g. loading of data). Pass in the label of the loading distractor
via `ng-content`.

<docs-source-example example="LoadingDistractorDefaultExample"></docs-source-example>

The loading distractor always appears vertically and horizontally centered on
the element, section or screen it is loading.

## Imports

You have to import the `DtLoadingDistractorModule` when you want to use the
`dt-loading-distractor` or `dt-loading-spinner`:

```typescript
@NgModule({
  imports: [DtLoadingDistractorModule],
})
class MyModule {}
```

## Accessibility

Each `<dt-loading-spinner>` should be given a meaningful label via `aria-label`
or `aria-labelledby`. The `aria-labelledby` attribute of the
`<dt-loading-distractor>` is set automatically based on the given content.

## Loading spinner in use

The loading spinner consists of an anmiated SVG circle and can be used in
combination with other components, e.g. a form field.

<docs-source-example example="LoadingDistractorSpinnerExample"></docs-source-example>

### Loading spinner inside a form field

When a `<dt-loading-spinner>` is placed as a prefix or suffix inside a
`<dt-form-field>` the color and size adjust automatically.

<docs-source-example example="LoadingDistractorInputExample"></docs-source-example>

### Loading spinner in buttons

If loading is caused by triggering a [button]({{link_to_id id='button' }}), the
loading distractor can be shown in the button. The button gets disabled and the
loading distractor is placed left aligned in the button with a description.

{{#figure styleguide='true'}}
![Loading distractor in button](https://d24pvdz4mvzd04.cloudfront.net/test/loading-button-416-7cb2ba6cef.png)
{{#figcaption}}

```
x: 16px
y: 8px
```

#### Loading spinner

```
width: 16px
height: 16px
color: same as disabled button font
```

{{/figcaption}} {{/figure}}

### Loading spinnner in comboboxes

{{#figure styleguide='true'}}
![Loading distractor in comboboxes](https://d24pvdz4mvzd04.cloudfront.net/test/loading-combobox-355-0d7a853704.png)
{{#figcaption}}

```
x: 12px
```

#### Loading spinner

```
width: 12px
height: 12px
color: $gray-500
```

{{/figcaption}} {{/figure}}
