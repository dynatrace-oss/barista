---
type: "component"
---

# Table

<docs-source-example example="TableDefaultComponent" fullwidth="true"></docs-source-example>

## Description

The DT Angular data table enhances the [Material's cdk table](https://material.angular.io/cdk/table/overview) but it also limits it in this first implementation (we are removing unneeded things from the public API)
Styleguide: [Table Style Guide](***REMOVED***

## Imports

You have to import the `DtTableModule` when you want to use the `dt-table`.
If you want to use the `dt-expandable-cell` component, Angular's Angular's `BrowserAnimationsModule`  is also required for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtTableModule } from '@dyntrace/angular-components';

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
| `dtColumnAlign` | Attribute | Type for the column (to be used in the alignment and for future versions add pipes and masks), possibles types are left-alignment `['left', 'text', 'id'],` center-alignment `['center', 'icon', 'control'],` right-alignment `['right', 'number', 'date', 'ip']` |
| `dtColumnProportion` | Attribute | A number describing the width proportion for the column `[dtColumnProportion]=2` means that this column will be double width as the regular ones |
| `dtColumnMinWidth` | Attribute | A CSS string describing the minimum width for the column `[dtColumnMinWidth]="'200px'"` means that this column will be at least 200px width |
| `dt-header-cell` | Directive | Adds the right classes (the generic dt-header-cell and the cell specific dt-column-css_friendly_column_name) and role (so the browser knows how to parse it. In this case it makes it act as a column header in a native html table) |
| `*dtHeaderCellDef` | Attribute | Captures the template of a column's header cell (the title for the column in the header) and as well as cell-specific properties so that the table can render the header properly.  |
| `dt-cell` | Component | Adds the right classes and role (so the browser knows how to parse it. In this case it makes it act as a grid cell in a native html table) |
| `dt-expandable-cell` | Component | Adds the right classes, role and content for the details cell in an expandable table |
| `*dtCellDef` | Attribute | Exports the the row data and the same properties as an [*ngFor](https://angular.io/api/common/NgForOf) so that you can define what the cell should show. It also captures the template of the column's data row cell |
| `dt-header-row` | Component | Placeholder for the header row. It is a container that contains the cell outlet. Adds the right class and role |
| `*dtHeaderRowDef` | Attribute | Defines the visible columns in the header out of all the defined ones by receiving a columnName[] |
| `dt-row` | Component | Placeholder for the data rows. It is a container that contains the cell outlet. Adds the right class and role |
| `dt-expandable-row` | Component | Placeholder for the expandable data rows. It is a container that contains the cell outlet and an expandable section. Adds the right class and role |
| `*dtRowDef` | Attribute | Defines the visible columns in each row by receiving a columnName[] and also exposes the same micro-syntax that the dt-cell but for event and property binding |
| `dtTableEmptyState` | Directive | Placeholder for the content displayed when the table is empty |
| `dt-table-empty-state` | Component | Placeholder for the formatted content displayed when the table is empty |
| `dt-table-empty-state-image` | Component | Placeholder for the image or icon to use within the `<dt-table-empty-table>` |
| `dt-table-empty-state-title` | Component | Placeholder for the title to use within the `<dt-table-empty-table>` |
| `dt-table-empty-state-message` | Component | Placeholder for the message to use within the `<dt-table-empty-table>` |
| `dtTableLoadingState` | Directive | Placeholder for the content displayed when the table is loading |

## Inputs & Outputs

| Name | Direction | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `dataSource` | input | `object[] | Observable | DataSource ` | `undefined` | Data to be shown in the table |
| `isLoading` | input | `boolean` | `false` | Whether the Table is loading or not |

There are no outputs at this stage. The table is totally passive.

## Table Usage

The cdk table stablishes a very different approach on how to define the table template. It does not use the native HTML table. So there is no td, tr, th involved.
Instead, you need to define all possible columns that the table may show (depending on the data available) and then define the table header and body by selecting from the column definitions, which subset of columns you will show.

Each column definition is created with dt-header-cell and dt-cell inside an [ng-container](https://angular.io/guide/structural-directives#ngcontainer) structural directive with a dtColumDef attribute directive applied to it.

```html

<ng-container dtColumnDef="username">
  <dt-header-cell *dtHeaderCellDef> User name </dt-header-cell>
  <dt-cell *dtCellDef="let row"><span ngNonBindable>{{row.a}}</dt-cell>
</ng-container>

```

(dtCellDef not only exports the row data but also the same properties as *ngFor using the same [micro-syntax](https://gist.github.com/mhevery/d3530294cff2e4a1b3fe15ff75d08855))
The table header is defined next with a dt-header-row component and a dtHeaderRowDef directive:

```html

<dt-header-row *dtHeaderRowDef="['username', 'age', 'title']"><dt-header-row>

```

If you want to make the header sticky you can add the `dtHeaderRowDefSticky` input to the `dtHeaderRowDef` directive. 

```html
<dt-header-row *dtHeaderRowDef="['username', 'age', 'title']; sticky"><dt-header-row>
```

And finally the table row is defined with a dt-row component and a dtRowDef directive:

```html

<dt-row *dtRowDef="let row; columns: ['username', 'age', 'title']"></dt-row>

```

(note: The dtRowDef also exports row context, which can be used for event and property bindings on the row element)
See the source code of any of the examples in this page to see all the pieces in place

### Width proportion

You can customize the column width proportion with `[dtColumnProportion]`

<docs-source-example example="TableDifferentWidthComponent" fullwidth="true"></docs-source-example>

### Tables with two lines per row

 If you want to have 2 lines of text and maybe an icon inside a row you can use the `<dt-info-group-cell>` component. You can also take a look at the `<dt-info-group-cell>` component's page for further information.

<docs-source-example example="TableWithInfoGroupCellComponent" fullwidth="true"></docs-source-example>

### Minimum Width

You can customize the column minimun width with `[dtColumnWidth]`

<docs-source-example example="TableMinWidthComponent" fullwidth="true"></docs-source-example>

### Empty state

You can pass an empty state to the table to be displayed when there's no data displayed using the `dtTableEmptyState` directive
The recommended approach to use it is using the following components: `<dt-table-empty-state>`, `<dt-table-empty-state-image>`, `<dt-table-empty-state-title>`, `<dt-table-empty-state-message>`

<docs-source-example example="TableEmptyStateComponent" fullwidth="true"></docs-source-example>

Also you can pass custom content using the same `dtTableEmptyState`

<docs-source-example example="TableEmptyCustomStateComponent" fullwidth="true"></docs-source-example>

### Loading state

You can mark the Table as loading using `[isLoading]` and pass the content to display with `dtTableLoadingState` directive

<docs-source-example example="TableLoadingComponent" fullwidth="true"></docs-source-example>

### Observable as DataSource

You can pass an Observable to the `[dataSource]` property

<docs-source-example example="TableObservableComponent" fullwidth="true"></docs-source-example>

### Dynamic Columns

You can bind the column definitions to an array with a `*ngFor` directive

<docs-source-example example="TableDynamicColumnsComponent" fullwidth="true"></docs-source-example>

The DataSource type is an abstract class with two methods: connect and disconnect. Connect has to return an Observable that the table subscribes to. Disconnect does cleanup. Usin this class to wrap the data provided for the table allows for maximum flexibility and will be the responsible of a future sort, and filter functionalities

## Expandable Table Rows

Expandable rows can be defined using `dt-expandable-row`. An optional details cell can be added using `dt-expandable-cell`.

<docs-source-example example="TableExpandableRowsComponent" fullwidth="true"></docs-source-example>

### Options & Properties of DtExpandableRow

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Ouput() openedChange` | `EventEmitter<DtExpandableRow>` |  | Event emitted when the expanded state changes. |
| `@Input() multiple` | `boolean` | `false` | Sets the mode for expanding multiple rows at a time. NOTE: must not be used in Dynatrace UI! |
| `expanded` | `boolean` | `false` | Gets or sets the expanded state of a row. |
| `contentViewContainer` | `ViewContainerRef` |  | Gets a reference to the expandable container for dynamically adding components. |

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

## Styling

The styling will be set for the core component and cannot be changed by the developer using the component. The component should be them-able, though.
The only things the developer can set are

* the type of table which changes not only the functionality available but also (behind the scenes) some of the styling.
* the responsiveness of the table

```typescript

type TableType = 'static' | 'dynamic'
responsive: Boolean

Ex:
...

```

Both type and responsive are optional and have default values

* type -> static
* responsive -> true

The table will always

* show a zebra pattern between alternating rows.
* align each data type (and its column header) in a specific way

## Theming

The table styling depends on the theme the component is in. You can set a theme on an area of the app by using the `dtTheme` directive.

### Sticky header

To apply a sticky header to the table set the `sticky` input on the `dtHeaderRowDef` directive.

<docs-source-example example="TableStickyHeaderComponent" fullwidth="true"></docs-source-example>

### Table hover

To apply the hover effect for the table add interactiveRows on the `dt-table` component.

<docs-source-example example="TableHoverComponent" fullwidth="true"></docs-source-example>

## Sorting

<docs-source-example example="TableSortingComponent" fullwidth="true"></docs-source-example>

The `DtSort` and `dt-sort-header` are used to add sorting functionality to the table.

To add sorting capabilities to your tables add the `dtSort` directive to the `dt-table` component. For each column that should be sortable by the user add `dt-sort-header` to the `dt-header-cell`. The `dt-sort-header` registers itself with the id given to the `dtColumnDef` with the `DtSort` directive.

```html
<dt-table ... dtSort ...>
```

And use the `dt-sort-header` component for the header cells.

```html
<dt-header-cell dt-sort-header ...>
```

### DtSort

You can set the following inputs and outputs on the `dtSort` directive. 

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() dtSortActive` | `string` | | The id of the most recent active column |
| `@Input() dtSortDirection` | `DtSortDirection` | `asc` | The sort direction of the currently active column |
| `@Input() dtSortDisabled` | `boolean` | `false` | Wether sorting is disabled for the entire table |
| `@Input() dtSortStart` | `DtSortDirection` | | Whe direction to set when an DtSortHeader is initially sorted. May be overriden by the DtSortHeader's sort start. |
| `@Output('dtSortChange') sortChange` | `EventEmitter<DtSortEvent>` | | Event emmited when the user changes either the active sort or the sorting direction.


#### Methods

| Name | Description | Parameters | Return value |
| --- | --- | --- |
| `sort` | Sets the active sort id and new sort direction | `sortable: DtSortHeader` | `void` |

### DtSortHeader

You can set the following inputs and outputs on the `dt-sort-header` component. 

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `@Input() disabled` | `boolean` | | Wether sorting is disabled for this sort header |
| `@Input()  start` | `DtSortDirection` | `asc` | Overrides the sort start value of the containing `DtSort`. |
| `@Input()  sort-aria-label` | `string` | | Sets the aria label for the button used for sorting |

#### Accessibility 

Please provide a `sort-aria-label` for each `dt-sort-header` to make the sorting experience accessible for all users. E.g. `Change sort order for column hosts`.

### DtSortDirection

The type used for the sort direction either `asc` or `desc`

### DtSortEvent

The event emitted when the user changes either the active sort or the sorting direction. The event contains the following properties.

| Name | Type | Description |
| --- | --- | --- |
| `active` | `string` | the id of the currently active column |
| `direction` | `DtSortDirection` | The direction for the currently active column |

To see a combination with initial sort direction and active column and disabling behaviour - please see the following complex example.

<docs-source-example example="TableSortingFullComponent" fullwidth="true"></docs-source-example>

## Problem & Warning Indicator

To get an error or warning indicator use the `dtIndicator` directive inside your `dt-cell` components on any html element or on your `dt-cell` component directly. The `dt-row` and `dt-expandable-row` will pick up if any `dtIndicator` was used inside the row's `dt-cell` and show the correct indicator. If one indicator has color `error` set the indicator on the row is an error indicator. Error trumps warning.
You can control the active state of the indicator by using the input named the same as `dtIndicator`.

```html
<dt-cell [dtIndicator]="active" ...>
```

The full example below shows both usages - single metric inside a cell and the entire cell enhanced with the dtIndicator for table with either static and expandable rows.

<docs-source-example example="TableProblemComponent" fullwidth="true"></docs-source-example>

<docs-source-example example="TableExpandableProblemComponent" fullwidth="true"></docs-source-example>

**NOTE:**

Right now only setting the light or dark mode is available. Full theming functionality will be added in a later stage.
As per the style guide: "The table component can be either a static or an interactive element. It can be used to drill down to a details page and there is also the possibility to add, remove, edit a table row or even expand a row for further information."

This version of the core table component just addresses a static data table. No user interaction with it allowed. So just groundhog's standard and responsive tables (equivalent to classes `.table .table–responsive`).
This version does not yet allow for any of the following capabilities that Dynatrace's data tables need

### Responsive table

Since some tables might have a lot of data in them and screen space is very limited especially on devices with smaller screens you might want to switch between a table with expandable rows and normal rows. The example below shows a very simple approach how this might be done.

<docs-source-example example="TableResponsiveComponent" fullwidth="true"></docs-source-example>

* Edit mode
* Move Up/Down

All pending functionality will be progressively addressed by future versions
