# InfoGroup

An info group (`<dt-info-group>`) is used to show data in a simple way. It's a
visual container for combining an icon with two lines of text (title and
content). It often comes with multiple instances of itself to give a quick
overview and summarize content, e.g. inside a table cell.

<docs-source-example example="InfoGroupDefaultExample"></docs-source-example>

The textual content could be a link, otherwise the info group has no
interactivity. The color of the icon is themeable. The width is defined by the
space that is left.

## Basic setup

In addition to the custom content, the info-group can also hold some special
sections (directives):

- `<dt-info-group-title>` - The title of this info group.
- `<dt-info-group-content>` - The text right below the title.
- `<dt-info-group-icon>` - The icon on the left of the info group is themeable.

## Imports

You have to import the `DtInfoGroupModule` when you want to use the
`<dt-info-group>`:

```typescript
@NgModule({
  imports: [DtInfoGroupModule],
})
class MyModule {}
```
