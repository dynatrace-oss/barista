# Datepicker (experimental)

<ba-live-example name="DtExampleDatepickerDefault" fullwidth></ba-live-example>

<ba-live-example name="DtExampleDatepickerDark" fullwidth themedark></ba-live-example>

## Imports

You have to import the `DtDatepickerModule` and `DtNativeDateModule` (in case
you would like to use the native date adapter) to use the `dt-datepicker`. The
DtNativeDateModule is based off the functionality available in JavaScript's
native Date object, which is limited when it comes to setting the parse format.
Therefore, if necessary, a custom DateAdapter can be implemented in order to
handle the formatting/parsing library of your choice.

```typescript
import { NgModule } from '@angular/core';
import { DtDatepickerModule } from '@dynatrace/barista-components/experimental/datepicker';
import { DtNativeDateModule } from '@dynatrace/barista-components/core';

@NgModule({
  imports: [DtDatepickerModule, DtNativeDateModule],
})
class MyModule {}
```

## Inputs

| Name           | Type        | Default | Description                                                                                                                        |
| -------------- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| value          | `D \| null` | `null`  | The selected date.                                                                                                                 |
| startAt        | `D \| null` | `null`  | The date to open the calendar to initially. Is ignored if `selected` is set. Defaults to today's date internally for display only. |
| min            | `D \| null` | `null`  | The minimum valid date.                                                                                                            |
| max            | `D \| null` | `null`  | The maximum valid date.                                                                                                            |
| disabled       | `boolean`   | `false` | Whether the datepicker is disabled.                                                                                                |
| isTimeEnabled  | `boolean`   | `false` | Whether or not the time mode is enabled.                                                                                           |
| isRangeEnabled | `boolean`   | `false` | Whether or not the range mode is enabled.                                                                                          |

#### Methods

The following methods are on the `DtDatepicker` class:

| Name        | Description                             | Return value |
| ----------- | --------------------------------------- | ------------ |
| `open`      | Opens the datepicker                    | `void`       |
| `close`     | Closes the datepicker                   | `void`       |
| `toggle`    | Toggles the datepicker                  | `void`       |
| `panelOpen` | Returns the open or closed panel state. | `boolean`    |
