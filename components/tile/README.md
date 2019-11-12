---
title: 'Tile'
description: 'A tile is a clickable area and represents e.g. entities.'
postid: tile
identifier: 'Ti'
category: 'components'
public: true
contributors:
  dev:
    - fabian.friedl
  ux:
    - raphaela.raudaschl
themable: true
tags:
  - 'tiles'
  - 'content'
  - 'layout'
  - 'dashboard'
  - 'list'
  - 'angular'
  - 'component'
---

# Tile

A tile is a clickable area and represents e.g. entities. Tiles can contain other
components. Currently, there are two types of tiles: list tiles and dashboard
tiles.

<docs-source-example example="TileDefaultExample"></docs-source-example>

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

<docs-source-example example="TileDefaultExample"></docs-source-example>

If only a `<dt-tile-title>` and no `<dt-tile-subtitle>` is given, the tile will
be rendered in a smaller version.

<docs-source-example example="TileSmallExample"></docs-source-example>

## Inputs

| Name       | Type                  | Default     | Description                                                                                |
| ---------- | --------------------- | ----------- | ------------------------------------------------------------------------------------------ |
| `disabled` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined.                |
| `color`    | `string | undefined`  | `undefined` | Sets color. Possible options: <ul><li>`main`</li><li>`error`</li><li>`recovered`</li></ul> |
| `tabindex` | `number`              | `0`         | Sets tabindex on the tile.                                                                 |

## States

Tiles have a default, hover, active, focus and disabled state. The following
example shows the disabled state.

<docs-source-example example="TileDisabledExample"></docs-source-example>

## Themes and Colors

The tile component can be colored according to the page's theme.

<docs-source-example example="TileMainExample"></docs-source-example>

### Recovered Tile

<docs-source-example example="TileRecoveredExample"></docs-source-example>

### Error Tile

<docs-source-example example="TileErrorExample"></docs-source-example>
