---
type: "component"
---

# Table

<docs-source-example example="TableDefaultComponent" fullwidth="true"></docs-source-example>

## Description

The `DtTable` enhances the [Material's cdk table](https://material.angular.io/cdk/table/overview). This first implementation also removes unneeded things from the public API.

## Imports

You have to import the `DtTableModule` to use the `dt-table`.
If you want to use the `dt-expandable-cell` component, Angular's `BrowserAnimationsModule` is required for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtTableModule } from '@dynatrace/angular-components';

@NgModule({
  imports: [
    BrowserAnimationsModule
    DtTableModule,
  ],
})
class MyModule {}

```

### Component and attribute directives for the table:

| Component/Attribute | Type | Description |
| --- | --- | --- |
| `dtColumnDef` | Attribute | Name for the column (to be used in the header and row definitions)  |
| `dtColumnAlign` | Attribute | Type for the column (to be used in the alignment and for future versions add pipes and masks), possible values are: left-alignment `['left', 'text', 'id'],` center-alignment `['center', 'icon', 'control'],` right-alignment `['right', 'number', 'date', 'ip']` |
| `dtColumnProportion` | Attribute | A number describing the width proportion for the column. `[dtColumnProportion]=2` means that this column's width will be doubled compared to the regular ones |
| `dtColumnMinWidth` | Attribute | A CSS string describing the minimum width for the column. `[dtColumnMinWidth]="'200px'"` means that this column's width will be at least 200px |
| `dt-header-cell` | Directive | Adds the appropriate classes (the generic dt-header-cell and the cell specific dt-column-css_friendly_column_name) and role (so the browser knows how to parse it. In this case it makes it act as a column header in a native html table) |
| `*dtHeaderCellDef` | Attribute | Captures the template of a column's header cell (the title for the column in the header) as well as cell-specific properties so the table can render it's header properly.  |
| `dt-cell` | Component | Adds the appropriate classes and role (so the browser knows how to parse it. In this case it makes it act as a grid cell in a native html table) |
| `dt-expandable-cell` | Component | Adds the appropriate classes, role and content for the details cell in an expandable table |
| `*dtCellDef` | Attribute | Exports the row data and the same properties as an [*ngFor](https://angular.io/api/common/NgForOf) in a way you can define what the cell should show. It also captures the template of the column's data row cell |
| `dt-header-row` | Component | Placeholder for the header row. It is a container that contains the cell outlet. Adds the appropriate class and role |
| `*dtHeaderRowDef` | Attribute | Defines the visible columns in the header out of all defined ones by receiving a columnName[] |
| `dt-row` | Component | Placeholder for the data rows. It is a container for the cell outlet. Adds the right class and role |
| `dt-expandable-row` | Component | Placeholder for the expandable data rows. It is a container for the cell outlet and an expandable section. Adds the right class and role |
| `*dtRowDef` | Attribute | Defines the visible columns in each row by receiving a columnName[] and also exposes the same micro-syntax that the dt-cell but for event and property binding |
| `dtTableEmptyState` | Directive | Placeholder for the content displayed when the table is empty |
| `dt-table-empty-state` | Component | Placeholder for the formatted content displayed when the table is empty |
| `dt-table-empty-state-image` | Component | Placeholder for the image or icon to use within the `<dt-table-empty-table>` |
| `dt-table-empty-state-title` | Component | Placeholder for the title to use within the `<dt-table-empty-table>` |
| `dt-table-empty-state-message` | Component | Placeholder for the message to use within the `<dt-table-empty-table>` |
| `dtTableLoadingState` | Directive | Placeholder for the content displayed when the table is loading |

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `dataSource` | `object[] | Observable | DataSource ` | | Data to be shown in the table |
| `isLoading` | `boolean` | `false` | **DEPRECATED - will be removed with 3.0.0** Use `loading` instead. |
| `loading` | `boolean` | `false` | Whether the table is loading or not. |
| `multiExpand` | `boolean` | `false` | Whether the table allows multiple rows to be expanded at a time. |

There are no outputs at this stage. The table is totally passive.

## Table Usage

The cdk table has a very different approach on how to define the table template, it does not use the native HTML table. Therefore, there is no `td`, `tr` or `th` involved.
Instead, you need to define all possible columns that the table may show (depending on the data available) and then define the table header and body by selecting from the column definitions, which subset of columns you want to show.

Each column definition is created with `dt-header-cell` and `dt-cell` inside a [ng-container](https://angular.io/guide/structural-directives#ngcontainer) structural directive with a `dtColumDef` attribute directive applied to it.

```html

<ng-container dtColumnDef="username">
  <dt-header-cell *dtHeaderCellDef> User name </dt-header-cell>
  <dt-cell *dtCellDef="let row"><span ngNonBindable>{{row.a}}</dt-cell>
</ng-container>

```

Note: `dtCellDef` not only exports the row data but also the same properties as `*ngFor`- using the same [micro-syntax](https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855). The table header is defined with a `dt-header-row` component and a `dtHeaderRowDef` directive:

```html

<dt-header-row *dtHeaderRowDef="['username', 'age', 'title']"><dt-header-row>

```

To make the header sticky, add the `dtHeaderRowDefSticky` input to the `dtHeaderRowDef` directive. 

```html
<dt-header-row *dtHeaderRowDef="['username', 'age', 'title']; sticky"><dt-header-row>
```

And finally the table row is defined with a `dt-row` component and a `dtRowDef` directive:

```html

<dt-row *dtRowDef="let row; columns: ['username', 'age', 'title']"></dt-row>

```

Note: The `dtRowDef` also exports row context, which can be used for event and property bindings on the row element. See the source code of any of the examples in this page to see all the pieces in place.

### Width proportion

You can customize the column width proportion with the `[dtColumnProportion]` attribute.

<docs-source-example example="TableDifferentWidthComponent" fullwidth="true"></docs-source-example>

### Tables with two lines per row

If you want to have 2 lines of text and maybe an icon inside a row you can use the `<dt-info-group>` component. You can also take a look at the `<dt-info-group>` component's page for further information.

<docs-source-example example="TableWithInfoGroupCellComponent" fullwidth="true"></docs-source-example>

### Minimum Width

You can customize the column minimun width with `[dtColumnMinWidth]`

<docs-source-example example="TableMinWidthComponent" fullwidth="true"></docs-source-example>

### Empty state

You can pass an empty state to the table using the `dtTableEmptyState` directive, this will be used when there's no data.
The recommended approach is to use the following components: `<dt-table-empty-state>`, `<dt-table-empty-state-image>`, `<dt-table-empty-state-title>`, `<dt-table-empty-state-message>`

<docs-source-example example="TableEmptyStateComponent" fullwidth="true"></docs-source-example>

You can also pass custom content using the same `dtTableEmptyState`.

<docs-source-example example="TableEmptyCustomStateComponent" fullwidth="true"></docs-source-example>

### Loading state

You can mark the table as loading using `[loading]` and pass the content to display with `dtTableLoadingState` directive

<docs-source-example example="TableLoadingComponent" fullwidth="true"></docs-source-example>

### Observable as DataSource

You can pass an Observable to the `[dataSource]` property.

<docs-source-example example="TableObservableComponent" fullwidth="true"></docs-source-example>

### Dynamic Columns

You can bind the column definitions to an array with a `*ngFor` directive.

<docs-source-example example="TableDynamicColumnsComponent" fullwidth="true"></docs-source-example>

The DataSource type is an abstract class with two methods: connect and disconnect. Connect has to return an Observable that the table subscribes to. Disconnect does cleanup. Using this class to wrap the data provided for the table allows maximum flexibility and will be responsible of a future sort, and filter functionalities.

## Expandable Table Rows

Expandable rows can be defined using `dt-expandable-row`. An expandable row **has to** contain a column with a details cell. A details cell can be added using `dt-expandable-cell`.

<docs-source-example example="TableExpandableRowsComponent" fullwidth="true"></docs-source-example>

Multiple rows can be expanded at a time. The expanded state of each row can be set programmatically.

<docs-source-example example="TableMultiExpandableRowsComponent" fullwidth="true"></docs-source-example>

### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | **DEPRECATED - will be removed with 3.0.0** Use `multiExpand` input of table instead. Sets the mode for expanding multiple rows at a time. |
| `expanded` | `boolean` | `false` | Whether the row is expanded or not. |

### Outputs

| Name | Type | Description |
| --- | --- | --- |
| `openedChange` | `EventEmitter<DtExpandableRow>` | **DEPRECATED - will be removed with 3.0.0, use `expandChange` instead** Event emitted when the expanded state changes. |
| `expandChange` | `EventEmitter<DtExpandableRowChangeEvent>` | Event emitted when the row's expandable state changes. |
| `expanded` | `EventEmitter<DtExpandableRow>` | Event emitted when the row is expanded. |
| `collapsed` | `EventEmitter<DtExpandableRow>` | Event emitted when the row is collapsed. |

### Properties

| Name | Type | Description |
| --- | --- | --- |
| `contentViewContainer` | `ViewContainerRef` | **DEPRECATED - will be removed with 3.0.0** Gets a reference to the expandable container for dynamically adding components. |

### Options and Properties of DtExpandableCell

Expandable rows have to contain one column definition which contains a `dt-expandable-cell`. A sample column definition for the details column could look like this: 

```html
<ng-container dtColumnDef="details" dtColumnAlign="number">
  <dt-header-cell *dtHeaderCellDef>Details</dt-header-cell>
  <dt-expandable-cell *dtCellDef ariaLabel="Expand the row"></dt-expandable-cell>
</ng-container>
```

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` |  | Aria label that describes the action of toggling the state of the expandble-row. |

## Programmatic access

### Through the table object

* `addColumnDef()`
* `removeColumnDef()`
* `addRowDef()`
* `removeRowDef()`
* `renderRows()`
* `setHeaderRowDef()`

### Through the header object

* `getColumnsDiff()`

## Theming

The table styling depends on the page theme. You can set a theme on an area of the app by using the `dtTheme` directive.

### Sticky header

To apply a sticky header to the table set the `sticky` input on the `dtHeaderRowDef` directive.

<docs-source-example example="TableStickyHeaderComponent" fullwidth="true"></docs-source-example>

### Table hover

To apply the hover effect for the table add interactiveRows on the `dt-table` component.

<docs-source-example example="TableHoverComponent" fullwidth="true"></docs-source-example>

## Sorting

<docs-source-example example="TableSortingComponent" fullwidth="true"></docs-source-example>

The `DtSort` and `dt-sort-header` are used to add sorting functionality to the table.

To add sorting capabilities to your table add the `dtSort` directive to the `dt-table` component. For each column that should be sortable by the user add `dt-sort-header` to the `dt-header-cell`. The `dt-sort-header` registers itself with the id given to the `dtColumnDef` with the `DtSort` directive.

```html
<dt-table ... dtSort ...>
```

And use the `dt-sort-header` component for the header cells.

```html
<dt-header-cell dt-sort-header ...>
```

### DtSort

You can set the following inputs and outputs on the `dtSort` directive. 


#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `dtSortActive` | `string` | | The id of the most recent active column |
| `dtSortDirection` | `DtSortDirection` | `asc` | The sort direction of the currently active column |
| `dtSortDisabled` | `boolean` | `false` | Wether sorting is disabled for the entire table |
| `dtSortStart` | `DtSortDirection` | | Sort direction in which a column is initially sorted. May be overriden by the DtSortHeader's sort start. |


#### Outputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `sortChange` | `EventEmitter<DtSortEvent>` | | Event emmited when the user changes either the active sort or the sorting direction.


#### Methods

| Name | Description | Parameters | Return value |
| --- | --- | --- | --- |
| `sort` | Sets the active sort id and new sort direction | `sortable: DtSortHeader` | `void` |

### DtSortHeader

You can set the following inputs and outputs on the `dt-sort-header` component. 


#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | | Wether sorting is disabled for this sort header |
| `start` | `DtSortDirection` | `asc` | Overrides the sort start value of the containing `DtSort`. |
| `sort-aria-label` | `string` | | Sets the aria label for the button used for sorting |

#### Accessibility 

Please provide a `sort-aria-label` for each `dt-sort-header` to make the sorting experience accessible for all users. E.g. `Change sort order for column hosts`.

### DtSortDirection

The type used for the sort direction either `asc` or `desc`

### DtSortEvent

The event emitted when the user changes either the active sort or the sorting direction. The event contains the following properties.

| Name | Type | Description |
| --- | --- | --- |
| `active` | `string` | The id of the currently active column |
| `direction` | `DtSortDirection` | The direction for the currently active column |

To see a combination with initial sort direction and active column and disabling behaviour - please see the following complex example.

<docs-source-example example="TableSortingFullComponent" fullwidth="true"></docs-source-example>

## Problem & Warning Indicator

To get an error or warning indicator use the `dtIndicator` directive inside your `dt-cell` components on any html element or on your `dt-cell` component directly. The `dt-row` and `dt-expandable-row` will pick up if any `dtIndicator` was used inside the row's `dt-cell` and show the correct indicator. If one indicator has color `error` set the indicator on the row is an error indicator (Error trumps warning).
You can control the active state of the indicator by using the input named the same as `dtIndicator`.

```html
<dt-cell [dtIndicator]="active" ...>
```

The full example below shows both usages - single metric inside a cell and the entire cell enhanced with the dtIndicator for table with either static and expandable rows.

<docs-source-example example="TableProblemComponent" fullwidth="true"></docs-source-example>

<docs-source-example example="TableExpandableProblemComponent" fullwidth="true"></docs-source-example>

### Responsive table

Since some tables might have a lot of data in them and screen space is very limited especially on devices with smaller screens you might want to switch between a table with expandable rows and normal rows. The example below shows a very simple approach how this might be done.

<docs-source-example example="TableResponsiveComponent" fullwidth="true"></docs-source-example>

All pending functionality will be progressively addressed by future versions

## Simple Columns

The `dtSimpleColumn` are an abstraction layer to the full fledged table implementation to make usage of recurring-patterns easier and to reduce boiler plate code that needs to be written to generate a simple table. 

### Inputs

The `dtSimpleColumn` provides a couple of inputs, which give the user easy access to certain functionality of the `dtTable` like sorting, formatting, error/warning indicators. 

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | - | The name of the `dtSimpleColumn` refers to the name of the column which it uses to register itself at the table. This name can be used to reference the column in the `dt-row`. The name input is the only **required** input on the simple column. |
| `label` | `string` | - | The label defines the string rendered into the header-cell of the given column. If no label is given, the `name` of the cell is being used. _(Optional)_ | 
| `sortable` | `boolean` | `true` | The sortable input defines whether the column should be sortable. If a sortable `dtSimpleColumn` is used within a table, the table needs the `dtSort` directive. |
| `displayAccessor<T>` | `(data: T, name: string) => any` | - | The displayAccessor function can be used to extract the displayable data from any row data. The name property passes the currently rendered column name, which can be used for more generic functions. If no `displayAccessor` is given, the `dtSimpleColumn` tries to extract a displayable data from `rowData[name]`. _(Optional)_ |
| `sortAccessor<T>` | `(data: T, name: string) => string|number` | - | The sortAccessor function can be used to extract sortable data from any row data. The name property passes the currently rendered column name, which can be used for more generic functions. This sortAccessor function will be used by the dataSource to access sortable values from the row data. _(Optional)_ |
| `formatter` | `(displayValue: any) => string|DtFormattedValue` |  - | The formatter function can be used to fomat the displayed value, with either prepared DtFormatter functions or custom functions. Can be used on top of the displayAccessor function or standalone. The function gets passed either the output from the displayAccessor or the fallback data. _(Optional)_ |
| `hasProblem<T>` | `(data: T, name: string) => DtIndicatorThemePalette` | - | The hasProblem function can be used to evaluate if a cell should add the `dtIndicator` and if it should display `error` or `warning`. The function gets passed the row data and the name of the current column, which allows for more generic functions. The function needs to return either `error` or `warning` if a problem should be active. _(Optional)_ |

### Versions

Currently there are two predefined versions of the `dtSimpleColumn` exposed: `dt-simple-number-column` and `dt-simple-text-column`. There are only small differences between the number and text column:

**dt-simple-text-column** 

* When sorting this column, the sort direction will start ascending, e.g. A -> Z
* Column alignment is set to `text` -> left

**dt-simple-number-column** 

* When sorting this column, the sort direction will start descending, e.g. 100 -> 0
* Column alignemnt is set to `number` -> right
* When no formatter is given, the `dtCount` formatter will automatically be applied, e.g. 1000 -> 1k

### Example

<docs-source-example example="TableSimpleColumnsComponent" fullwidth="true"></docs-source-example>

### Sorting, paging and filtering out of the box with DtTableDataSource

`dtSimpleColumns` integrate out of the box with the `DtTableDataSource`. Unified sorting (locale-aware for strings, null/undefined value treatment) is possible when using the DtTableDataSource. To do this, create a new `DtTableDataSource` instance with the data. You will have to connect the input instances for `dtSort` to the `DtTableDataSource`. 

```ts
@Component({
  moduleId: module.id,
  template: `<dt-table [dataSource]="dataSource" dtSort #sortable>
    [... column and row definitions]
  </dt-table>`,
})
export class TableComponent implements AfterViewInit {
  // Get the viewChild to pass the sorter reference to the datasource.
  @ViewChild('sortable', { read: DtSort }) sortable: DtSort;

  // Create the Datasource instanciate it.
  dataSource: DtTableDataSource<object>;
  constructor() {
    this.dataSource = new DtTableDataSource(this.data);
  }

  // Connect the `dtSort` instance to the DtTableDataSource
  ngAfterViewInit(): void {
    this.dataSource.sort = this.sortable;
  }
}
```

### Pagination

<docs-source-example example="TablePaginationComponent" fullwidth="true"></docs-source-example>

Further examples of the `DtPagination` in combination with a `DtTableDataSource` can be found under the [pagination](/components/pagination#dynamic-showhide-of-paginated-table) page.

### Show more

<docs-source-example example="TableShowMoreComponent" fullwidth="true"></docs-source-example>

### Filtering with highlight of the filtered value

<docs-source-example example="TableFilteringComponent" fullwidth="true"></docs-source-example>

### Extending DtSimpleColumn

Of course you can extend from the simpleColumn to create your own predefined simplecolumn. To do this, simply extend from the `DtSimpleColumnBase<T>` abstract class and implement the deviation that suits your needs. A basic template for the simpleColumn could look like this (example from the `dt-simple-number-column`).

```html
<ng-container [dtColumnDef]="name" dtColumnAlign="number">
  <ng-container *dtHeaderCellDef>
    <dt-header-cell *ngIf="!sortable" >{{ label || name }}</dt-header-cell>   
    <dt-header-cell *ngIf="sortable" dt-sort-header start="desc">{{ label || name }}</dt-header-cell>
  </ng-container>
  <dt-cell *dtCellDef="let data" [dtIndicator]="_getIndicator(data, name)" [dtIndicatorColor]="_getIndicator(data, name)">{{ _getData(data) }}</dt-cell>
</ng-container>
```
