---
title: 'Info group'
description:
  'An info group visualizes properties by combining an icon and a short text.'
postid: info-group
identifier: 'Ig'
category: 'components'
layout: page-angular.hbs
public: true
toc: true
themable: true
contributors:
  dev:
    - fabian.friedl
  ux:
    - andreas.mayr
related:
  - 'icon'
  - 'card'
  - 'table'
tags:
  - 'icon'
  - 'info'
  - 'infobyte'
---

# Info group

An info group (`<dt-info-group>`) is used to show data in a simple way. It's a
visual container for combining an icon with two lines of text (title and
content). It often comes with multiple instances of itself to give a quick
overview and summarize content, e.g. inside a table cell.

<docs-source-example example="InfoGroupDefaultExample"></docs-source-example>

The textual content could be a link, otherwise the info group has no
interactivity. The color of the icon is themeable. The width is defined by the
space that is left.

## Imports

You have to import the `DtInfoGroupModule` when you want to use the
`<dt-info-group>`:

```typescript
@NgModule({
  imports: [DtInfoGroupModule],
})
class MyModule {}
```

## Basic setup

In addition to the custom content, the info-group can also hold some special
sections (directives):

- `<dt-info-group-title>` - The title of this info group.
- `<dt-info-group-content>` - The text right below the title.
- `<dt-info-group-icon>` - The icon on the left of the info group is themeable.

## Info groups in use

### Info groups in cards

An info group can be used in a [card]({{link_to_id id='card'}}) and on the top
of a page to show properties.

<!-- TODO: make component demo -->

{{#figure imagebox='true' fullwidth='true'}}
![info-group-grid](https://d24pvdz4mvzd04.cloudfront.net/test/info-group-grid-1238-55e3252ddf.png)
{{/figure}}

### Info groups in tables

Info groups are also used in the first column of a
[table]({{link_to_id id='table'}}) or in a list. They can provide additional
information without the use of a second column. A column with info groups is
always sorted by the data in the first line.

<docs-source-example example="TableWithInfoGroupCellExample" fullwidth="true"></docs-source-example>

<docs-source-example example="TreeTableDefaultExample" fullwidth="true"></docs-source-example>
