---
type: 'component'
---

# Menu

The `<dt-menu>` is a generic navigation menu that supports item groups as well
as individual items that do not belong to a group. It can be used as a
standalone component, in a `<dt-drawer>` or in a `<dt-context-dialog>`.

To set the content for a menu component, the following tags are available:

- `<dt-menu-group>` - A menu group with a label that can contain one or more
  menu items
- `<a dtMenuItem>`/`<button dtMenuItem>` - A menu item which can either be
  represented by an anchor (if the item is used for site navigation) or a button
  (in case the item should merely trigger some code)

<docs-source-example example="MenuDefaultExample"></docs-source-example>

## Imports

You have to import the `DtMenuModule` when you want to use the `<dt-menu>`:

```typescript
@NgModule({
  imports: [DtMenuModule],
})
class MyModule {}
```

## DtMenu Inputs

| Name       | Type   | Default     | Description                                 |
| ---------- | ------ | ----------- | ------------------------------------------- |
| aria-label | string | `undefined` | An accessibility label describing the menu. |

## DtMenuGroup Inputs

| Name  | Type   | Default     | Description                   |
| ----- | ------ | ----------- | ----------------------------- |
| label | string | `undefined` | The header of the menu group. |

## Examples

Uses a menu within a [context dialog](/components/context-dialog) component.

<docs-source-example example="MenuWithinContextDialogExample"></docs-source-example>

Uses a menu within a [drawer](/components/drawer) component.

<docs-source-example example="MenuWithinDrawerExample" fullwidth="true"></docs-source-example>
