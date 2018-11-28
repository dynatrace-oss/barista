---
type: "component"
---

# Tile

<docs-source-example example="DefaultTileExampleComponent"></docs-source-example>

## Imports

You have to import the `DtTileModule` when you want to use the `dt-tile`:

```typescript
@NgModule({
  imports: [
    DtTileModule,
  ],
})
class MyModule {}
```

## Initialization

`<dt-tile>` is a visual container for wrapping a wide variety of contents.
In addition to the custom content, the tile can also hold some special sections:

* `<dt-tile-title>` - The title of this tile, needs to be defined to show the tile's header
* `<dt-tile-subtitle>` - Right below the title, a subtitle can be placed.
* `<dt-tile-icon>` - An icon in the top left corner of the card. The icon can also be aligned to the right by setting `align="end"` on the `dt-tile-icon` **not ready yet:**Use `<dt-icon>` for it as soon as it is ready

If only a `<dt-tile-title>` and no `<dt-tile-subtitle>` the tile will be rendered in a small version

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined |
| `color` | `string | undefined` | `undefined` | Sets color. Possible options: <ul><li>`main`</li><li>`error`</li><li>`recovered`</li></ul> |
| `tabindex` | `number` | `-1` | Sets tabindex on the tile |

### Disabled Tile

<docs-source-example example="DisabledTileExampleComponent"></docs-source-example>

### Small Tile

<docs-source-example example="SmallTileExampleComponent"></docs-source-example>

### Main Tile

<docs-source-example example="MainTileExampleComponent"></docs-source-example>

### Recovered Tile

<docs-source-example example="RecoveredTileExampleComponent"></docs-source-example>

### Error Tile

<docs-source-example example="ErrorTileExampleComponent"></docs-source-example>
