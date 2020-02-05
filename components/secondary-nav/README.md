# Secondary nav

<ba-ux-snippet name="secondary-nav-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleSecondaryNavDefault"></ba-live-example>

A title for the secondary nav is optional. The secondary nav contains individual
expandable and non-expandable menu sections. Within a section the title is
mandatory whereas a description is optional. Links within a section can be a
list or grouped according to categories.

## Imports

You have to import the `DtSecondaryNavModule` when you want to use the
`<dt-secondary-nav>`.

```typescript
@NgModule({
  imports: [DtSecondaryNavModule],
})
class MyModule {}
```

## Initialization

Use the `<dt-secondary-nav>` to add a secondary nav element to your page. Add a
`<dt-secondary-nav-title>` element if the secondary nav should have a headline.

By using the `<dt-secondary-nav-section>` element, which is provided in the
secondary-nav module, you can add individual expandable and non-expandable menu
items. Within each section element, you must provide a
`<dt-secondary-nav-section-title>`, and you can provide the optional
`<dt-secondary-nav-section-description>` for titles and descriptions.

Within the section element, you define links with `<a dtSecondaryNavLink>`
directive elements. Links can be wrapped in groups with the
`<dt-secondary-nav-group>` element. The `dtSecondaryNavLink` directive must be
included on inner section links in order to style them.

## DtSecondaryNav

### Inputs

| Name         | Type      | Description                                                                  |
| ------------ | --------- | ---------------------------------------------------------------------------- |
| `aria-label` | `string`  | An accessibility label describing the menu.                                  |
| `multi`      | `boolean` | Whether or not the nav allows multiple sections to be opened simultaneously. |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

## DtSecondaryNavSection

### Inputs

| Name         | Type      | Description                                                      |
| ------------ | --------- | ---------------------------------------------------------------- |
| `expanded`   | `boolean` | Whether or not the section is expanded.                          |
| `expandable` | `boolean` | Whether or not the section can be expanded.                      |
| `active`     | `boolean` | Whether or not the section is active and is highlighted.         |
| `external`   | `boolean` | Whether or not the section link routes internally or externally. |
| `href`       | `string`  | The router path or URL used for navigation.                      |

### Outputs

| Name           | Type                    | Description                                     |
| -------------- | ----------------------- | ----------------------------------------------- |
| `expandChange` | `EventEmitter<boolean>` | Emits an event when the expanded state changes. |
| `expanded`     | `EventEmitter<void>`    | Event emitted when the section is expanded.     |
| `collapsed`    | `EventEmitter<void>`    | Event emitted when the section is collapsed.    |

## DtSecondaryNavGroup

### Inputs

| Name    | Type     | Description                                                              |
| ------- | -------- | ------------------------------------------------------------------------ |
| `label` | `string` | The value used in the group label, displayed above the cluster of links. |

## Multiple sections open simultaneously

By default, only one section can be opened at a time unless the `multi` input is
added to `<dt-secondary-nav>`.

<ba-live-example name="DtExampleSecondaryNavMulti"></ba-live-example>

## Setting an active section and link

In order to set the section to a highlighted active state, the
`<dt-secondary-nav-section>` has a `active` input that can be used as a
directive or as an input. In order to set a `dtSecondaryNavLink` to a
highlighted active state, you must add the following css class:
`dt-secondary-nav-active`.

<ba-live-example name="DtExampleSecondaryNavActive"></ba-live-example>

## Setting external links

`<dt-secondary-nav>` can be used to route to external links when the
`expandable` input is not included or set to false. Then you must use the
`external` input.

<ba-live-example name="DtExampleSecondaryNavExternal"></ba-live-example>

## Disabling expandable sections

In order to disable the expanding behavior of a section and use it as a regular
menu link, do not include the `expandable` input on
`<dt-secondary-nav-section>`.

<ba-live-example name="DtExampleSecondaryNavExpandable"></ba-live-example>

## Removing the title

`<dt-secondary-nav-title>` is optional and can safely be excluded in order to
hide the nav header.

<ba-live-example name="DtExampleSecondaryNavTitle"></ba-live-example>
