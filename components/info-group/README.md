# Info group

An info group (`<dt-info-group>`) is used to show data in a simple way. It's a
visual container for combining an icon with two lines of text (title and
content). It often comes with multiple instances of itself to give a quick
overview and summarize content, e.g. inside a table cell.

<ba-live-example name="DtExampleInfoGroupDefault"></ba-live-example>

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

An info group can be used in a [card](/components/card) and on the top of a page
to show properties.

<ba-live-example name="DtExampleInfoGroupInCard" fullwidth background></ba-live-example>

### Info groups in tables

Info groups are also used in the first column of a [table](/components/table) or
in a list. They can provide additional information without the use of a second
column. A column with info groups is always sorted by the data in the first
line.

<ba-live-example name="DtExampleTableWithInfoGroupCell" fullwidth></ba-live-example>

<ba-live-example name="DtExampleTreeTableDefault" fullwidth></ba-live-example>
