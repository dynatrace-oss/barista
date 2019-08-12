---
type: 'component'
---

# Filter field

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
| `loading`    | `boolean`                 | `false` | Whether the filter-field is loading data and should show a loading spinner.                                      |

## Outputs

| Name                   | Type                                                  | Description                                                                                                              |
| ---------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `filterChanges`        | `EventEmitter<DtFilterFieldChangeEvent>`              | Event emitted when filters have been added or removed.                                                                   |
| `currentFilterChanges` | `EventEmitter<DtFilterFieldCurrentFilterChangeEvent>` | Event emitted when a part has been added to the currently selected filter (the filter the user is currently working on). |
| `inputChange`          | `EventEmitter<string>`                                | Event emitted when the input value changes (e.g. when the user is typing).                                               |

## Distinct options

Normally you can select all options of an autocomplete, but sometimes there is
also the need to remove the whole list of options once one of them is selected
(e.g. when you only want the user to select one city of a full list).

You can do that by setting the `distinct: true` property onto the autocomplete
object.

<docs-source-example example="FilterFieldDistinctExample"></docs-source-example>

## Loading options asynchronously

When working with huge sets of data, there is often the need to load parts of
them asynchronously when the user needs it. You can do this by setting the
`async: true` property on the autocomplete instead of options, then load the
data and apply it to the data source.

## Data source

The filter-field needs a `DtFilterFieldDataSource` so data can be applied. The
main purpose of the data source is to convert the data that should be fed into
the filter-field into a form the filter-field can understand.

_Note: Provide only one data source instance per filter-field._

A `DataSource` needs to be a class that implements the `DtFilterFieldDataSource`
interface.

The filter-field provides a default implementation of a `DataSource`, named
`DtFilterFieldDefaultDataSource`, that takes a specific form of data
(`DtFilterFieldDefaultDataSourceType`). If your data has a different form you
can either transform your data so the default data source can understand it, or
you create your own custom data source.

When creating a custom data source, we also provide a lot of utility functions
for converting and creating data into the form of definition node objects the
filter-field can understand. You can also take a look at the implementation of
the `DtFilterFieldDefaultDataSource` to get a better understanding on how to
create a custom data source.

### Data utility functions

A list of the most useful utility functions for creating and checking definition
node objects:

| Name                  | Description                                                                                                            |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| `dtAutocompleteDef`   | Creates a node definition object or extends one and applies an autocomplete definition object based on the parameters. |
| `isDtAutocompleteDef` | Whether the provided definition object is of type `NodeDef` and consists of an autocomplete definition.                |
| `dtFreeTextDef`       | Creates a node definition object or extends one and applies a free-text definition object based on the parameters.     |
| `isDtFreeTextDef`     | Whether the provided definition object is of type `NodeDef` and consists of a free-text definition.                    |
| `dtOptionDef`         | Creates a node definition object or extends one and applies an option definition object based on the parameters.       |
| `isDtOptionDef`       | Whether the provided definition object is of type `NodeDef` and consists of an option definition.                      |
| `dtGroupDef`          | Creates a node definition object or extends one and applies a group definition object based on the parameters.         |
| `isDtGroupDef`        | Whether the provided definition object is of type `NodeDef` and consists of a group definition.                        |

## Filters

Every filter is an array of:

- Objects that have been selected via an autocomplete (the object is exactly the
  one the consumer has provided via the data source).
- Strings that the user has typed in via a free text.
- Objects that include the result of a range selected by the user. This includes
  the range operator (`DtFilterFieldRangeOperator`), the unit (`string`) of the
  selected values and the range itself (which can either be one `number` value
  or a `number` tuple).

### Receiving the selected filters

Two outputs on the filter-field help you receiving the filters when:

- A filter has been added or removed - `filterChanges`.
- A part of a filter has been added or removed (a filter has been edited) -
  `currentFilterChanges`.

#### `filterChanges`

This stream emits when a new filter has been added to the current filter list or
an existing one has been removed. The event emitted is an instance of
`DtFilterFieldChangeEvent` which includes the following properties:

- `source`: The instance of the filter-field that emitted this event.
- `added`: An array of filters that have been added.
- `filters` The full list of the selected filters including the added ones.

#### `currentFilterChanges`

This stream emits an event when a filter is edited which means new parts have
been added or removed. The emitted event is an instance of
`DtFilterFieldCurrentFilterChangeEvent` which includes the following properties:

- `source`: The instance of the filter-field that emitted this event.
- `added`: The array of parts that have been added to the filter.
- `removed`: The array of parts that have been removed from the filter.
- `currentFilter`: The current filter (list of parts) that has been edited.
- `filters` The full list of the selected filters including the one that has
  been edited.

### Adding filters programmatically

To set filters programmatically, the filter-field has a `filters` input. Assign
the filters you want to set to this property. Be aware, there are a few
requirements that need to be fulfilled so that the filters can be applied
properly.

1. The filters applied need to be part of and match the data (by reference) that
   is currently provided via the data source.
2. Setting filters that have parts that are not yet loaded and therefore behind
   an async flag is currently not supported (Watch the following issue to be
   notified when this is possible:
   [***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***)).
3. Setting the filters will override all the currently selected ones.

<docs-source-example example="FilterFieldProgrammaticFiltersExample"></docs-source-example>
