# InfoGroup

`<dt-info-group>` is a visual container for combining an icon with two lines of text. It is often used inside a table cell.

*Note:* The info group is **not interactive**.

In addition to the custom content, the info-group can also hold some special sections (directives):
* `<dt-info-group-title>` - The title of this info group.
* `<dt-info-group-content>` - The text right below the title.
* `<dt-info-group-icon>` - The icon on the left of the info group is themeable.

<docs-source-example example="InfoGroupDefaultExample"></docs-source-example>

## Imports

You have to import the `DtInfoGroupModule` when you want to use the `<dt-info-group>`:

```typescript
@NgModule({
  imports: [
    DtInfoGroupModule,
  ],
})
class MyModule {}
```
