# Tile

A tile is a clickable area and represents e.g. entities. Tiles can contain other
components.

<ba-live-example name="DtExampleTileDefault"></ba-live-example>

## Imports

You have to import the `DtTileModule` when you want to use the `dt-tile`:

```typescript
@NgModule({
  imports: [DtTileModule],
})
class MyModule {}
```

## Initialization

`<dt-tile>` is a visual container for wrapping a wide variety of contents. In
addition to custom content, the tile also holds the following sections:

- `<dt-tile-title>` - The title of this tile, needs to be defined to show the
  tile's header. It contains text only.
- `<dt-tile-subtitle>` - Right below the title, a subtitle can be placed. It
  contains text only.
- `<dt-tile-icon>` - An icon in the top left corner of the tile.

If only a `<dt-tile-title>` and no `<dt-tile-subtitle>` is given, the tile will
be rendered in a smaller version.

<ba-live-example name="DtExampleTileSmall"></ba-live-example>

## Inputs

| Name       | Type                  | Default     | Description                                                                                |
| ---------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `disabled` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined.                |
| `color`    | `string | undefined`  | `undefined` | Sets color. Possible options: <ul><li>`main`</li><li>`error`</li><li>`recovered`</li></ul> |
| `tabindex` | `number`              | `0`         | Sets tabindex on the tile.                                                                 |

## States

Tiles have a default, hover, active, focus and disabled state. The following
example shows the disabled state.

<ba-live-example name="DtExampleTileDisabled"></ba-live-example>

## Themes and Colors

The tile component can be colored according to the page's theme.

<ba-live-example name="DtExampleTileMain"></ba-live-example>

### Recovered Tile

<ba-live-example name="DtExampleTileRecovered"></ba-live-example>

### Error Tile

<ba-live-example name="DtExampleTileError"></ba-live-example>
