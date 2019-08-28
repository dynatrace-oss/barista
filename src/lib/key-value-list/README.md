---
title: 'Key-value list'
description: 'The key-value list component is used to visualize properties.'
postid: key-value-list
category: 'components'
public: true
toc: true
contributors:
  dev:
    - fabian.friedl
    - daniel.moertenschlag
  ux:
    - andreas.mayr
tags:
  - 'meta data'
  - 'list'
  - 'key-value'
  - 'definition list'
  - 'angular'
  - 'component'
---

# Key-value list

The key-value list is used to visualize properties as key-value-pairs. The
key-value list behaves responsively and can span multiple columns when enough
space is available.

<docs-source-example example="KeyValueListDefaultExample"></docs-source-example>

## Imports

You have to import the `DtKeyValueListModule` when you want to use the
`dt-key-value-list`:

```typescript
@NgModule({
  imports: [DtKeyValueListModule],
})
class MyModule {}
```

## Initialization

Use the key-value list `<dt-key-value-list>` tag in conjunction with the
`<dt-key-value-list-item>` tag. Every list item contains a
`<dt-key-value-list-key>` followed by a `<dt-key-value-list-value>`. Use the
following tags to define the list and its items.

- The `<dt-key-value-list>` tag itself to create the component,
- the `<dt-key-value-list-item>` to create a separate entry for each item,
- the `<dt-key-value-list-key>` or `[dt-key-value-list-key]` or
  `[dtKeyValueListKey]` to define the item's key (left label) to be displayed
  and
- the `<dt-key-value-list-value>` or `[dt-key-value-list-value]` or
  `[dtKeyValueListValue]` to define the items value (right label) to be
  displayed.

## Inputs

| Name      | Type     | Default     | Description                                                                                                                               |
| --------- | -------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `columns` | `number` | `undefined` | The number of columns the key-value list spans. If not set, the number is calculated based on the number of list items. The maximum is 6. |

## Key-value list in use

Only use text with basic inline markup and links as content of key and value
elements.

### Multiple columns

If there is enough space available, the key-value list spans multiple columns.

<docs-source-example example="KeyValueListMulticolumnExample" fullwidth="true"></docs-source-example>

### Multiple columns with line breaks

Line breaks in keys or values are also possible when the text gets too long.

<docs-source-example example="KeyValueListLongtextExample" fullwidth="true"></docs-source-example>
