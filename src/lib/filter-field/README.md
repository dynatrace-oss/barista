---
type: 'component'
---

# Filter field (Experimental)

<docs-source-example example="FilterFieldDefaultExample"></docs-source-example>

## Imports

You have to import the `DtFilterFieldModule` when you want to use the
`dt-filter-field`.

```typescript
@NgModule({
  imports: [DtFilterFieldModule],
})
class MyModule {}
```

## Inputs

| Name         | Type                      | Default | Description                                                                                                      |
| ------------ | ------------------------- | ------- | ---------------------------------------------------------------------------------------------------------------- |
| `dataSource` | `DtFilterFieldDataSource` |         | Provide a DataSource to feed data to the filter-field. This input is mandatory.                                  |
| `filters`    | `any[][]`                 |         | The currently selected filters. This input can also be used to programmatically add filters to the filter-field. |
| `label`      | `string`                  |         | The label for the input field. Can be set to something like "Filter by".                                         |
| `loading`    | `boolean`                 | `false` | Whether the filter field is loading data and should show a loading spinner.                                      |

## Outputs

| Name                   | Type                                                  | Description                                                                                                              |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `filterChanges`        | `EventEmitter<DtFilterFieldChangeEvent>`              | Event emitted when filters have been added or removed.                                                                   |
| `currentFilterChanges` | `EventEmitter<DtFilterFieldCurrentFilterChangeEvent>` | Event emitted when a part has been added to the currently selected filter (the filter the user is currently working on). |
| `inputChange`          | `EventEmitter<string>`                                | Event emittend when the input value changes (e.g. when the user is typing).                                              |

## Distinct Options

Normally you can select all options of an autocomplete, but sometimes there is
also the need to remove a the whole list of options once one of them is selected
(e.g. when you only want the user to select one city of full list).

You can do that by setting the `distinct: true` property onto the autocomplete
object.

<docs-source-example example="FilterFieldDistinctExample"></docs-source-example>

## Loading Options asynchronously

When working with huge sets of data, there is often the need to load parts of it
asynchronously when the user needs it. You can do this by setting the
`async: true` property on the autocomplete instead of options, then load the
data and apply it to the Data Source.

## Data Source

The filter-field needs a `DtFilterFieldDataSource` so data can be applied. The
main part of the Data Source is to convert the data that should be fed into the
filter-field into a form the filter-field can understand.

A `DataSource` needs to be a class that implements the `DtFilterFieldDataSource`
interface.

The filter-field provides a default implementation of a DataSource, named
`DtFilterFieldDefaultDataSource`, that takes a specific form of data. If your
data has a different form you can either transform your data so the Default Data
Source can understand it, or you create your own custom Data Source.

When creating a custom Data Source, we also provide a lot of utility functions
for converting and creating data into the form of definition node objects the
filter-field can understand. You can also take a look at the implementation of
the `DtFilterFieldDefaultDataSource` to get a better understanding on how to
create a custom Data Source

## Data utility functions:

A list of the most useful utility function for creating and checking definition
node objects:

| Name                  | Description                                                                                                              |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `dtAutocompleteDef`   | Creates a node definition object or extends an one and applies a autocomplete definition object based on the parameters. |
| `isDtAutocompleteDef` | Whether the provided definitoin object is of type NodeDef and consists of an autocomplete definition                     |
| `dtFreeTextDef`       | Creates a node definition object or extends an one and applies a free-text definition object based on the parameters     |
| `isDtFreeTextDef`     | Whether the provided definitoin object is of type NodeDef and consists of an free-text definition                        |
| `dtOptionDef`         | Creates a node definition object or extends an one and applies a option definition object based on the parameters.       |
| `isDtOptionDef`       | Whether the provided definitoin object is of type NodeDef and consists of an option definition                           |
| `dtGroupDef`          | Creates a node definition object or extends an one and applies a group definition object based on the parameters.        |
| `isDtGroupDef`        | Whether the provided definitoin object is of type NodeDef and consists of an group definition                            |
