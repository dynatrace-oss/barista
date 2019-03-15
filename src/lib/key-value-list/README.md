---
type: "component"
---

# Key value list

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

Use the Dynatrace key value list `<dt-key-value-list>` tag in conjunction with the `<dt-key-value-list-item>` tag. Every list item contains a `<dt-key-value-list-key>` followed by a `<dt-key-value-list-value>`. Use the following tags to define the list and its items.

* The `<dt-key-value-list>` tag itself to create the component,
* the `<dt-key-value-list-item>` to create a separate entry for each item,
* the `<dt-key-value-list-key>` or `[dt-key-value-list-key]` or `[dtKeyValueListKey]` to define the item's key (left label) to be displayed and
* the `<dt-key-value-list-value>` or `[dt-key-value-list-value]` or `[dtKeyValueListValue]` to define the items value (right label) to be displayed.

Only use text with basic inline markup and links as content of key and value elements.

## Examples

### Single column

<docs-source-example example="DefaultKeyValueListExampleComponent"></docs-source-example>

### Multiple columns

<docs-source-example example="MulticolumnKeyValueListExampleComponent" fullwidth="true"></docs-source-example>

### Multiple columns with line breaks

<docs-source-example example="LongtextKeyValueListExampleComponent" fullwidth="true"></docs-source-example>
