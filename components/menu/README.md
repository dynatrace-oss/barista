# Menu

The `<dt-menu>` is a generic navigation menu that supports item groups as well
as individual items that do not belong to a group. It has a clear hierarchy and
allows for a condensed way to help users to navigate or perform actions. It can
be used as a standalone component, in a `<dt-drawer>` or in a
`<dt-context-dialog>`.

<ba-live-example name="DtExampleMenuDefault"></ba-live-example>

## Imports

You have to import the `DtMenuModule` when you want to use the `<dt-menu>`.

```typescript
@NgModule({
  imports: [DtMenuModule],
})
class MyModule {}
```

## Initialization

To set the content for a menu component, the following tags are available:

- `<dt-menu-group>` - A menu group with a label that can contain one or more
  menu items.
- `<a dtMenuItem>`/`<button dtMenuItem>` - A menu item which can either be
  represented by an anchor (if the item is used for site navigation) or a button
  (in case the item should merely trigger some code).

## DtMenu inputs

| Name       | Type     | Default     | Description                                 |
| ---------- | -------- | ----------- | ------------------------------------------- |
| aria-label | `string` | `undefined` | An accessibility label describing the menu. |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

## DtMenuGroup inputs

| Name  | Type   | Default     | Description                   |
| ----- | ------ | ----------- | ----------------------------- |
| label | string | `undefined` | The header of the menu group. |

## Menu in use

This component is typically used for static menus, such as the global navigation
menu in combination with a [drawer](/components/drawer) or menus in overlays
(e.g. user menu, or [context dialog](/components/context-dialog)).

<ba-live-example name="DtExampleMenuWithinDrawer" fullwidth></ba-live-example>

<ba-live-example name="DtExampleMenuWithinContextDialog"></ba-live-example>
