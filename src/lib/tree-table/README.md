---
type: "component"
---

# TreeTable

<docs-source-example example="DefaultTreeTableExample" fullwidth="true"></docs-source-example>

## Imports

You have to import the `DtTreeTableModule` when you want to use the `<dt-tree-table>`:

```typescript
@NgModule({
  imports: [
    DtTreeTableModule,
  ],
})
class MyModule {}
```

## Description

The `<dt-tree-table>` provides the functionality of a tree displayed in a grid/table. The api is very similar to the `<dt-table>` component. You define the different columns and rows and choose which columns should be rendered inside each row. It is also possible to have multiple different row templates that can be switched when a row should have a special behavior e.g. a show more row for lazy loading more rows.

## Usage

Start by adding the `<dt-tree-table>` component to your template and provide it with a datasource and a treecontrol. 

```html
<dt-tree-table [dataSource]="dataSource" [treeControl]="treeControl">
</dt-tree-table>
```

### Provide the data

Since a table is a flat structure but we want to show hierachical tree data there is a special datasource called `DtTreeDataSource` involved.  The `DtTreeControl` is responsible for controlling expanding/collapsing of nodes. 

```typescript
private _getLevel = (node: ThreadFlatNode) => node.level;

private _isExpandable = (node: ThreadFlatNode) => node.expandable;

this.treeControl = new DtTreeControl<ThreadFlatNode>(this._getLevel, this._isExpandable);
```

The `DtTreeFlattener` takes multiple accessor functions as parameters to transform the hierachical data to a flat datastructure that can be rendered inside the table. The `DtTreeFlattener` is a generic class that transforms a hierachical structure of nodes of type T to a flat structure of nodes of type F; In the example below it takes the hierachical type `ThreadNode` and transforms it to `ThreadFlatNode`.

```typescript
private _transformer = (node: ThreadNode, level: number): ThreadFlatNode => {
  ...
  return flatNode;
}
private _getLevel = (node: ThreadFlatNode) => node.level;

private _isExpandable = (node: ThreadFlatNode) => node.expandable;

private _getChildren = (node: ThreadNode): ThreadNode[] => node.children || [];

this.treeFlattener =  new DtTreeFlattener<ThreadNode, ThreadFlatNode>(this._transformer, this._getLevel, this._isExpandable, this._getChildren);
```

The `DtTreeDataSource` gets the `DtTreeFlattener` and the `DtTreeControl` as parameters. 
```typescript
this.dataSource = new DtTreeDataSource(this.treeControl, this.treeFlattener);
```
By assigning the data property on the datasource with a new set of data the tree-table is populated with the rows.

```typescript
this.dataSource.data = [
  {
    name: 'hz.hzInstance_1_cluster.thread',
    icon: 'apache-tomcat',
    threadlevel: 'S0',
    totalTimeConsumption: 150,
    waiting: 123,
    running: 20,
    blocked: 0,
    children: [
      {
        name: 'hz.hzInstance_1_cluster.thread_1_hz.hzInstance_1_cluster.thread-1',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 123,
        running: 20,
        blocked: 0,
      },
      {
        name: 'hz.hzInstance_1_cluster.thread-2',
        icon: 'apache-tomcat',
        threadlevel: 'S1',
        totalTimeConsumption: 150,
        waiting: 130,
        running: 0,
        blocked: 0,
      }
    ]
  },
]
```

### Adding column templates

To specify the different columns that are shown inside the table you have to define column templates. Each column consists of `<dt-tree-table-header-cell>` and either a `<dt-tree-table-toggle-cell>` or a `<dt-cell>` inside a `<ng-container>`.

The first column shown in the `<dt-tree-table>` has to include the `<dt-tree-table-toggle-cell>`. This special cell includes the indentation logic and the toggle button used to expand/collapse the next level of rows.

```html
 <ng-container dtColumnDef="name">
    <dt-tree-table-header-cell *dtHeaderCellDef>Name</dt-tree-table-header-cell>
    <dt-tree-table-toggle-cell *dtCellDef="let row">
      {{row.name}}
    </dt-tree-table-toggle-cell>
  </ng-container>
```

A normal column could like the following example

```html
 <ng-container dtColumnDef="waiting">
    <dt-tree-table-header-cell *dtHeaderCellDef>Waiting</dt-tree-table-header-cell>
    <dt-cell *dtCellDef="let row">
      {{row.waiting}}
    </dt-cell>
  </ng-container>
```

After adding all column definitions the next step is to add the row definitions.

### Adding rows

You want to add the table header by adding a `<dt-header-row>` inside the `<dt-tree-table>` tag. 

```html
<dt-header-row *dtHeaderRowDef="['name', 'total', 'blocked', 'running', 'waiting', 'actions']"></dt-header-row>
```

The next step is to add the row where the columns get rendered. You can do this by adding the `<dt-tree-table-row>` inside the `<dt-tree-table>` tag. You can specify the columns that should be rendered and don't forget to bind the row's data to the `<dt-tree-table-row>`s data input `[data]="row"`.

```html
<dt-tree-table-row *dtRowDef="let row; columns: ['name', 'total', 'blocked', 'running', 'waiting', 'actions'];" [data]="row"></dt-tree-table-row>
```

## Column alignment

If you want to specify an alignment for the content of a column you can do so by setting the `dtColumnAlign` input on the `<ng-container dtColumnDef=... dtColumnAlign="text">`

The `dtColumnAlign` input handles the following values: `'left' | 'right' | 'center'` or one of the typed values that get mapped to left, right and center internally `'text' | 'id' | 'icon' | 'control' | 'number' | 'date' | 'ip'`.

## DtIndicator

You can use the `DtIndicator` directive the same way as in the `<dt-table>` to indicate a warning/error in a row. This will result in a Problem indicator being shown in front of the row.

<docs-source-example example="ProblemIndicatorTreeTableExample" fullwidth="true"></docs-source-example>

## Options & Properties & Methods

### DtTreeTable

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `treeControl` | `DtTreeControl<T>` | - | Input for the treeControl that handles expand/collapse of rows |
| `ariaLabel` | `string` | '' | Input for the aria label of the treetable |
| `hasInteractiveRows` | `boolean` | `false` | Input wether the tree-table should have interactive rows - results in a hover effect |
| `trackBy` | `Fn(index, T)` |  | Tracking function that will be used to check the differences in data changes. Used similarly to ngFor trackBy function. |

### DtTreeTableRow

#### Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | - | The data for the row. Note that this might be removed rather soon and made obsolete due to a feature request on the underlying cdk table |

### DtTreeControl

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `dataNodes` | `T[]` |  | Saved row data for expandAll action |
| `expansionModel` | `SelectionModel<T>` |  | A selection model to track expansion status |
| `getChildren` | `(row: T) => (Observable<T[]> | T[] | undefined | null)` |  | function that returns an observable containing the child rows, the child rows, undefined or null |
| `getLevel` | `(row: T) => number` |  | accessor fn for the level of the row |
| `isExpandable` | `(dataNode: T) => boolean` | | function that returns wether a node is expandable |

#### Methods

| Name | Return value | Description |
| --- | --- | --- |
| `collapse(row: T)` | `void` | collapses one single row |
| `collapseAll` | `void` | collapses all rows |
| `collapseDescendants(row: T)` | `void` | collapses all descendants of a row |
| `expand(row: T)` | `void` | expands one single row |
| `expandAll` | `void` | expands all rows |
| `expandDescendants(row: T)` | `void` | expands all descendants of a row |
| `getDescendants(row: T)` | `T[]` | Gets a list of descendant rows |
| `isExpanded(row: T)` | `boolean` | Wether a row is expanded |
| `toggle(row: T)` | `void` | Toggles a single row |
| `toggleDescendants(row: T)` | `void` | Toggles descendants of a row |

### DtTreeFlattener<T, F>

| `getChildren` | `(row: T) => (Observable<T[]> | T[] | undefined | null)` |  | function that returns an observable containing the child rows, the child rows, undefined or null |
| `getLevel` | `(row: T) => number` |  | accessor fn for the level of the row |
| `isExpandable` | `(row: T) => boolean` | | function that returns wether a node is expandable |
| `transformFunction` | `(row: T, level: number) => F` | | function that transforms from type T to flat type F |

<docs-source-example example="AsyncShowMoreTreeTable" fullwidth="true"></docs-source-example>
