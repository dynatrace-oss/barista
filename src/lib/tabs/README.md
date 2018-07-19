# Tabs

<docs-source-example example="DefaultTabsExampleComponent"></docs-source-example>

The `<dt-tab-group>` creates wraps a group of `<dt-tab>` components. Each tab gets a label and a content respectively. 
The label is provided with a `ng-template` with the directive `dtTabLabel`. The content is also declared with a `ng-template`, but with a directive called `dtTabContent`. By default the first enabled tab gets selected if no selected tab is specified.

## Imports

You have to import the `DtTabsModule` when you want to use the `<dt-tab-group>`:

```typescript
@NgModule({
  imports: [
    DtTabsModule,
  ],
})
class MyModule {}
```

## Initialization

To use the dynatrace tabs, add the following components/directives:

| Attribute                   | Description                                           |
| --------------------------- | ----------------------------------------------------- |
| `dt-tab-group`              | wrapping container for dt-tabs                        |
| `dt-tab`                    | definition for one tab containing a label and content |
| `ng-template dtTabLabel`    | label definition for one tab                          |
| `ng-template dtTabContent`  | content definition for one tab                        |

## Options & Properties

### DtTabGroup

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Ouput() selectionChanged` | `EventEmitter<DtTabChange>` |  | Event emitted when the selected tab changes, includes the selected tab instance |

### DtTab

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `selected` | `boolean | undefined` | `undefined` | Sets the selected state if property is set and the value is truthy or undefined |
| `disabled` | `boolean | undefined` | `undefined` | Sets disable state if property is set and the value is truthy or undefined |
| `color` | `string | undefined` | `main` | Sets color. Possible options: <ul><li><code>main</code> (default)</li><li><code>recovered</code></li><li><code>error</code></li></ul> |
| `tabindex` | `number` | 0 | Tabindexof the tab. |
| `id` | `string` | | The id of the tab. |
| `aria-label` | `string` |  | Aria label of the tab. |

## Theming

The button styling depends on the theme the component is in. You can set a theme on an area of the app by using the `dtTheme` directive.

## Examples

### Dynamic Tabs
<docs-source-example example="DynamicTabsExampleComponent"></docs-source-example>

### Interactive Tabs
<docs-source-example example="InteractiveTabsExampleComponent"></docs-source-example>


