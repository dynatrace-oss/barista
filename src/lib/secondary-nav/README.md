---
type: 'component'
---

# SecondaryNav

`<dt-secondary-nav>` is a navigation menu used to control in-app routing and
provide a way to display external links as well. By using the
`<dt-secondary-nav-section>` element, which is provided in the secondary-nav
module, you can add individual expandable and non-expandable menu items. Within
the section element, you must provide `<dt-secondary-nav-section-title>`, and
you can provide the optional `<dt-secondary-nav-section-description>` for titles
and descriptions. Also within the section element, you can define links with
`<a dtSecondaryNavLink>` directive elements, and wrap them in groups with the
`<dt-secondary-nav-group>` element. The `dtSecondaryNavLink` directive must be
included on inner section links in order to style them.

<docs-source-example example="SecondaryNavDefaultExample"></docs-source-example>

## Imports

You have to import the `DtSecondaryNavModule` when you want to use the
`<dt-secondary-nav>`:

```typescript
@NgModule({
  imports: [DtSecondaryNavModule],
})
class MyModule {}
```

## Options & Properties

### DtSecondaryNav (`<dt-secondary-nav>`)

| Name                  | Type      | Description                                                                  |
| --------------------- | --------- | ---------------------------------------------------------------------------- |
| `@Input() aria-label` | `string`  | An accessibility label describing the menu.                                  |
| `@Input() multi`      | `boolean` | Whether or not the nav allows multiple sections to be opened simultaneously. |

### DtSecondaryNavSection (`<dt-secondary-nav-section>`)

| Name                     | Type                    | Description                                                      |
| ------------------------ | ----------------------- | ---------------------------------------------------------------- |
| `@Input() expanded`      | `boolean`               | Whether or not the section is expanded.                          |
| `@Input() expandable`    | `boolean`               | Whether or not the section can be expanded.                      |
| `@Input() active`        | `boolean`               | Whether or not the section is active and is highlighted.         |
| `@Input() external`      | `boolean`               | Whether or not the section link routes internally or externally. |
| `@Input() href`          | `string`                | The router path or URL used for navigation.                      |
| `@Output() expandChange` | `EventEmitter<boolean>` | Emits an event when the expanded state changes.                  |
| `@Output() expanded`     | `EventEmitter<void>`    | Event emitted when the section is expanded.                      |
| `@Output() collapsed`    | `EventEmitter<void>`    | Event emitted when the section is collapsed.                     |

### DtSecondaryNavGroup (`<dt-secondary-nav-group>`)

| Name             | Type     | Description                                                              |
| ---------------- | -------- | ------------------------------------------------------------------------ |
| `@Input() label` | `string` | The value used in the group label, displayed above the cluster of links. |

## Multiple sections open simultaneously

By default, only one section can be opened at a time unless the `multi` input is
added to `<dt-secondary-nav>`.

_Example:_
<docs-source-example example="SecondaryNavMultiExample"></docs-source-example>

## Setting an active section and link

In order to set the section to a highlighted active state, the
`<dt-secondary-nav-section>` has a `active` input that can be used as a
directive or as an input. In order to set a `dtSecondaryNavLink` to a
highlighted active state, you must add the following css class:
`dt-secondary-nav-active`.

_Example:_
<docs-source-example example="SecondaryNavActiveExample"></docs-source-example>

## Setting external links

`<dt-secondary-nav>` can be used to route to external links when the
`expandable` input is not included or set to false. Then you must use the
`external` input.

_Example:_
<docs-source-example example="SecondaryNavExternalExample"></docs-source-example>

## Disabling expandable sections

In order to disable the expanding behavior of a section and use it as a regular
menu link, do not include the `expandable` input on
`<dt-secondary-nav-section>`.

_Example:_
<docs-source-example example="SecondaryNavExpandableExample"></docs-source-example>

## Removing the title

`<dt-secondary-nav-title>` is optional and can safely be excluded in order to
hide the nav header.

_Example:_
<docs-source-example example="SecondaryNavTitleExample"></docs-source-example>
