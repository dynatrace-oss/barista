# Top Bar Navigation

The navigation is a landmark on every page. A landmark provides a way to
identify the organization and structure of a web page. It can be used to display
some arbitrary data or to provide links to other sections of a page.

<ba-live-example name="DtExampleTopBarNavigationDefault"></ba-live-example>

## Imports

You have to import the `DtTopBarNavigationModule` when you want to use the
`<dt-top-bar-navigation>`.

```typescript
@NgModule({
  imports: [DtTopBarNavigationModule],
})
class MyModule {}
```

## Initialization

The `DtTopBarNavigation` component is a structural component which is used to
create a top bar navigation and align the navigation items on the right or left.

## DtTopBarNavigationItem

The `DtTopBarNavigationItem` directive is used to align the items on the left or
right side of the navigation bar.

This can be achieved with the `align` property.

### Inputs

| Name    | Type              | Default   | Description                                                                     |
| ------- | ----------------- | --------- | ------------------------------------------------------------------------------- |
| `align` | `'start' | 'end'` | `'start'` | If the item is placed on the left side or right side of the top navigation bar. |

## DtTopBarAction

The `DtTopBarAction` directive is used to apply the styling and hover behavior
to the navigation items. It provides the base styling for a typical icon
element. Furthermore it can handle a problem state when the `hasProblem` input
is set.

```html
<dt-top-bar-navigation aria-label="Main">
  <dt-top-bar-navigation-item align="start">
    <a dtTopBarAction hasProblem>41</a>
  </dt-top-bar-navigation-item>
</dt-top-bar-navigation>
```

| Name         | Type      | Default | Description                                |
| ------------ | --------- | ------- | ------------------------------------------ |
| `hasProblem` | `boolean` | `false` | Indicates if the item has a problem state. |

## Accessibility

The `aria-label` on the `DtTopBarNavigation` should be set to identify the role
of the navigation. It should be a brief description of the purpose of the
navigation, omitting the term "navigation", as the screen reader will read the
role and the contents of the label.

```html
<dt-top-bar-navigation aria-label="Main">
  ...
</dt-top-bar-navigation>
```

## Top Bar Navigation in use

<ba-live-example name="DtExampleTopBarNavigationDrawer"></ba-live-example>
