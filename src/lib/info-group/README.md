# InfoGroup

<docs-source-example example="DefaultInfoGroupExampleComponent"></docs-source-example>

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

## Initialization

`<dt-info-group>` is a visual container for combining an icon with two lines of text. The info group is not interactive.

* `<dt-info-group-title>` - The title of this info group.
* `<dt-info-group-content>` - The text right below the title.
* `<dt-info-group-icon>` - The icon on the left of the info group is themeable.
