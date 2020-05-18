# Quick Filter (experimental)

Note: This component is still experimental, use with caution! The API is NOT
stable, and might change in minor or patch versions of the library. Help us get
this component out of the experimental state by providing feedback.

<ba-ux-snippet name="quick-filter-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleQuickFilterDefault" fullwidth></ba-live-example>

## Imports

You have to import the `DtQuickFilterModule` when you want to use the
`<dt-quick-filter>`, `<dt-quick-filter-title>` and
`<dt-quick-filter-sub-title>`. Note that you need Angular's
`BrowserAnimationsModule` if you want to have animations or the
`NoopAnimationsModule` if you don't.

```typescript
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtQuickFilterModule } from '@dynatrace/barista-components/experimental/quick-filter';

@NgModule({
  imports: [BrowserAnimationsModule, DtQuickFilterModule],
})
class AppModule {}
```

To use the quick filter in your template there is the
`<dt-quick-filter [dataSource]="_dataSource">` where you have to bind the data
source. The default content within the `dt-quick-filter` will be placed within
the quick-filter main content area. To set the title and the subtitle of the
sidebar you can leverage the `<dt-quick-filter-title>` and
`<dt-quick-filter-sub-title>` tags to provide a level of customization.

## Inputs

| Name                | Type                      | Default | Description                                                                                                                         |
| ------------------- | ------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `dataSource`        | `DtQuickFilterDataSource` |         | Provide a DataSource to feed data to the filter field and the quick filter. This input is mandatory.                                |
| `filters`           | `any[][]`                 |         | The currently selected filters. This input can also be used to programmatically add filters to the quick filter and filter field.   |
| `label`             | `string`                  |         | The label for the input field. Can be set to something like "Filter by". Will be placed next to the filter icon in the filter field |
| `clearAllLabel`     | `string`                  |         | Label for the "Clear all" button in the filter field. Can be set to something like "Clear all".                                     |
| `aria-label`        | `string`                  |         | Sets the value for the Aria-Label attribute.                                                                                        |
| `groupHeadlineRole` | `number`                  |         | The aria-level of the group headlines for the document outline.                                                                     |

## Outputs

| Name                   | Type                                                  | Description                                                                                                 |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `filterChanges`        | `EventEmitter<DtQuickFilterChangeEvent>`              | Event emitted when filters have been updated by user interaction. Wont be triggered by programmatic changes |
| `currentFilterChanges` | `EventEmitter<DtQuickFilterCurrentFilterChangeEvent>` | Event emitted when filters in the filter field of the quick filter are edited.                              |
| `inputChange`          | `EventEmitter<string>`                                | Event emitted when the input value in the filter field of the quick filter changes.                         |
