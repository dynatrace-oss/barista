# Key Value List

This component creates a key value list with Dynatrace styling. It splits the provided elements automatically into 2 columns.

## Imports

You have to import the `DtKeyValueListModule` when you want to use the `dt-key-value-list`:

```typescript

@NgModule({
  imports: [
    DtKeyValueListModule,
  ],
})
class MyModule {}

```

## Initialization

Use the Dynatrace key value list `<dt-key-value-list>` tag in conjunction with the `<dt-key-value-list-item>` tag.

* The `<dt-key-value-list>` tag itself to create the component and
* The `<dt-key-value-list-item>` to create a separate entry for each item. The attributes `key` and `value` define the labels to be displayed.

## Options & Properties

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[key]` | `string` | | Gets the key label that should be displayed |
| `[value]` | `string` | | Gets the value label that should be displayed |

## Examples

### Single column

<docs-source-example example="DefaultKeyValueListExampleComponent"></docs-source-example>

### Multiple columns

<docs-source-example example="MulticolumnKeyValueListExampleComponent" fullwidth="true"></docs-source-example>

### Multiple columns with line breaks

<docs-source-example example="LongtextKeyValueListExampleComponent" fullwidth="true"></docs-source-example>
