# Info group

<ba-ux-snippet name="info-group-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleInfoGroupDefault"></ba-live-example>

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

<ba-ux-snippet name="info-group-in-use"></ba-ux-snippet>
