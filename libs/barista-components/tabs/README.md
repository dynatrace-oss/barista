# Tabs

The `<dt-tab-group>` wraps a group of `<dt-tab>` components. Each tab gets a
label and a content respectively. The label is provided with a `ng-template`
with the directive `dtTabLabel`. The content is also declared with a
`ng-template`, but with a directive called `dtTabContent`. By default the first
enabled tab gets selected if no selected tab is specified.

<ba-live-example name="DtExampleTabsDefault"></ba-live-example>

## Imports

You have to import the `DtTabsModule` when you want to use the `<dt-tab-group>`:

```typescript
@NgModule({
  imports: [DtTabsModule],
})
class MyModule {}
```

## Initialization

To use the Dynatrace tabs, add the following components/directives:

| Attribute                  | Description                                           |
| -------------------------- | ----------------------------------------------------- |
| `dt-tab-group`             | wrapping container for dt-tabs                        |
| `dt-tab`                   | definition for one tab containing a label and content |
| `ng-template dtTabLabel`   | label definition for one tab                          |
| `ng-template dtTabContent` | content definition for one tab                        |

## DtTabGroup outputs

| Name               | Type                        | Default | Description                                                                     |
| ------------------ | --------------------------- | ------- | ------------------------------------------------------------------------------- |
| `selectionChanged` | `EventEmitter<DtTabChange>` |         | Event emitted when the selected tab changes, includes the selected tab instance |

## DtTabGroup inputs

| Name         | Type                  | Default     | Description                                                                                                                           |
| ------------ | --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `selected`   | `boolean | undefined` | `undefined` | Sets the selected state if property is set and the value is truthy or undefined                                                       |
| `disabled`   | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined                                                            |
| `color`      | `string | undefined`  | `main`      | Sets color. Possible options: <ul><li><code>main</code> (default)</li><li><code>recovered</code></li><li><code>error</code></li></ul> |
| `tabindex`   | `number`              | 0           | Tabindexof the tab.                                                                                                                   |
| `id`         | `string`              |             | The id of the tab.                                                                                                                    |
| `aria-label` | `string`              |             | Aria label of the tab.                                                                                                                |

## Navigation

Tabgroups come with support for storing the selected tab for navigation
purposes. You can enable navigation for a `dt-tab-group` by adding the
`dtTabGroupNavigation` directive. The selected tab gets stored only on user
interaction. If an id of a `dt-tab` matches an id stored inside the
`DtTabNavigationAdapter` the tab gets selected. Ids stored in the
`DtTabNavigationAdapter` take presedence over the `selected` attribute on the
`dt-tab` component.

```html
<dt-tab-group dtTabGroupNavigation>
  <dt-tab id="traffic">
    <ng-template dtTabLabel>Traffic</ng-template>
    <ng-template dtTabContent>
      <h1>Traffic</h1>
    </ng-template>
  </dt-tab>
  <dt-tab id="quality">
    <ng-template dtTabLabel>Quality</ng-template>
    <ng-template dtTabContent>
      <h1>Quality</h1>
    </ng-template>
  </dt-tab>
</dt-tab-group>
```

The `DtTabModule` comes with a `DtTabRouterFragmentAdapter` service that stores
the id of the selected `dt-tab` inside the url fragment. If you want to
implement your own logic of storing the selected tab ids, e.g. in localStorage -
you need to implement the abstract class `DtTabNavigationAdapter` yourself.

Make sure to provide a `DtTabNavigationAdapter` with its dependencies in the
root of your application. E.g.

```typescript
...
providers: [
  { provide: DtTabNavigationAdapter,
    useClass: DtTabRouterFragmentAdapter,
    deps: [Router, ActivatedRoute, Location, LocationStrategy],
  },
],
...
```

## Theming

The button styling depends on the theme the component is in. You can set a theme
on an area of the app by using the `dtTheme` directive.

## States

Additionally to their default state tabs can be disabled, in an error- or
recovered-state.

<ba-live-example name="DtExampleTabsDefault"></ba-live-example>

### Problem indicator

If content in a tab is problematic the tab box as well as the text are red. If
content in a tab has recovered the tab item is green.

<ba-live-example name="DtExampleTabsDynamic"></ba-live-example>

## Do's and Don'ts

### Abbreviation of long tab names

Do: Abbreviate long names with "..."

![Do - abbreviate with ...](https://d24pvdz4mvzd04.cloudfront.net/test/tab-abbreviation-do-324-bbb38d763f.png)

Don't use more than one line for tabs.

![Don't - use multiple lines](https://d24pvdz4mvzd04.cloudfront.net/test/tab-abbreviation-dont-324-2beb0e2685.png)

### Single tabs

If there is only one tab, use a headline instead of a tab.

![Do - use headline instead of tab](https://d24pvdz4mvzd04.cloudfront.net/test/tab-single-do-290-f105648d41.png)

Don't use one single tab, a minimum of two tabs is required.

![Don't - use a single tab](https://d24pvdz4mvzd04.cloudfront.net/test/tab-single-dont-290-7282424245.png)

### Interactive Tabs

<ba-live-example name="DtExampleTabsInteractive"></ba-live-example>
