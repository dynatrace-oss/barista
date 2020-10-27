# Quick Filter

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
import { DtQuickFilterModule } from '@dynatrace/barista-components/quick-filter';

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

| Name                | Type                                                | Default                            | Description                                                                                                                                                                          |
| ------------------- | --------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dataSource`        | `DtQuickFilterDataSource`                           |                                    | Provide a DataSource to feed data to the filter field and the quick filter. This input is mandatory.                                                                                 |
| `filters`           | `any[][]`                                           | `[]`                               | The currently selected filters. This input can also be used to programmatically add filters to the quick filter and filter field.                                                    |
| `label`             | `string`                                            |                                    | The label for the input field. Can be set to something like "Filter by". Will be placed next to the filter icon in the filter field                                                  |
| `clearAllLabel`     | `string`                                            |                                    | Label for the "Clear all" button in the filter field. Can be set to something like "Clear all".                                                                                      |
| `aria-label`        | `string`                                            | `''`                               | Sets the value for the Aria-Label attribute.                                                                                                                                         |
| `groupHeadlineRole` | `number`                                            | `3`                                | The aria-level of the group headlines for the document outline.                                                                                                                      |
| `maxGroupItems`     | `number`                                            | `5`                                | The maximum amount of items that should be displayed in the quick filter sidebar. If there are more, then they are hidden behind a show more functionality                           |
| `showMoreTemplate`  | `TemplateRef<{ $implicit: number; group: string }>` | `+145 options in the filter field` | Template for the show more text of the group. The implicit context of the template is the count of the remaining items and the view value can be accessed through the group variable |

## Outputs

| Name                   | Type                                                  | Description                                                                                                 |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `filterChanges`        | `EventEmitter<DtQuickFilterChangeEvent>`              | Event emitted when filters have been updated by user interaction. Wont be triggered by programmatic changes |
| `currentFilterChanges` | `EventEmitter<DtQuickFilterCurrentFilterChangeEvent>` | Event emitted when filters in the filter field of the quick filter are edited.                              |
| `inputChange`          | `EventEmitter<string>`                                | Event emitted when the input value in the filter field of the quick filter changes.                         |

## Dealing with long list of items

In general, you should avoid displaying a long list of choices inside the quick
filter as it should only be a quick solution to apply a small set of filters.
Nevertheless, if there are more options they will be hidden in a detail view
that can be accessed through the **View More** Button. The content inside is
rendered through a virtual scroll and therefore you don't have to care about
performance.

You can configure what to display as the show more text for the group like in
the following example:

<ba-live-example name="DtExampleQuickFilterCustomShowMore" fullwidth></ba-live-example>
