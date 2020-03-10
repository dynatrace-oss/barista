# Drawer table (experimental)

<ba-live-example name="DtExampleDrawerTableDefault" fullwidth></ba-live-example>

The `DtDrawerTable` component uses table and drawer components. Table is the
main content of the drawer and row click of the table opens the drawer content
of the row.

## Imports

You have to import the `DtDrawerTableModule` to use the `dt-drawer-table`.

```typescript
import { NgModule } from '@angular/core';
import { DtDrawerTableModule } from '@dynatrace/barista-components/experimental/drawer-table';

@NgModule({
  imports: [DtDrawerTableModule],
})
class MyModule {}
```

## Inputs

The `DtDrawerTable` component supports the following input.

| Name          | Type       | Default      | Description                                                    |
| ------------- | ---------- | ------------ | -------------------------------------------------------------- |
| `openColumns` | `string[]` | first column | Defines the columns that stay visible when the drawer is open. |

#### Methods

The following methods are on the `DtDrawerTable` class:

| Name     | Description        | Return value |
| -------- | ------------------ | ------------ |
| `open`   | Opens the drawer   | `void`       |
| `close`  | Closes the drawer  | `void`       |
| `toggle` | Toggles the drawer | `void`       |
