# Datepicker (experimental)

The `dt-datepicker` can be used to select a date with (or without) a time.

<ba-live-example name="DtExampleDatepickerDefault" fullwidth></ba-live-example>

## Initialization

In order to use the datepicker in your template you need the `<dt-datepicker>`
element. Similarly, you can also use the `<dt-calendar>`, `<dt-calendar-body>`,
as well as `<dt-timepicker>` elements individually in your template.

## Imports

You have to import the `DtDatepickerModule` to use the `dt-datepicker`. The
datepicker works by default with the DtNativeDateAdapter, which is based off the
functionality available in JavaScript's native Date object. This is limited when
it comes to setting the parse format. Therefore, if necessary, a custom
DateAdapter can be implemented in order to handle the formatting/parsing library
of your choice.

```typescript
import { NgModule } from '@angular/core';
import { DtDatepickerModule } from '@dynatrace/barista-components/experimental/datepicker';

@NgModule({
  imports: [DtDatepickerModule],
})
class MyModule {}
```

Also, in order to enable dark mode, the `DtThemingModule` has to be imported and
`DT_OVERLAY_THEMING_CONFIG` needs to be provided, such as:

```typescript
import { NgModule } from '@angular/core';
import { DtDatepickerModule } from '@dynatrace/barista-components/experimental/datepicker';
import {
  DT_DEFAULT_DARK_THEMING_CONFIG,
  DT_OVERLAY_THEMING_CONFIG,
} from '@dynatrace/barista-components/core';

@NgModule({
  imports: [DtDatepickerModule, DtThemingModule],
   providers: [
    {
      provide: DT_OVERLAY_THEMING_CONFIG,
      useValue: DT_DEFAULT_DARK_THEMING_CONFIG,
    },
})
class MyModule {}
```

## Inputs

### Datepicker

| Name            | Type        | Default | Description                                                                                                                        |
| --------------- | ----------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| id              | `string`    | `null`  | The datepicker id.                                                                                                                 |
| value           | `T \| null` | `null`  | The selected date.                                                                                                                 |
| startAt         | `T \| null` | `null`  | The date to open the calendar to initially. Is ignored if `selected` is set. Defaults to today's date internally for display only. |
| disabled        | `boolean`   | `false` | Whether the datepicker is disabled.                                                                                                |
| isTimeEnabled   | `boolean`   | `false` | Whether or not the time mode is enabled, so that the time input fields are displayed as well.                                      |
| showTodayButton | `boolean`   | `false` | Whether or not the today button is shown.                                                                                          |
| tabIndex        | `number`    | 0       | The element's tab index.                                                                                                           |

### Calendar

| Name            | Type        | Default | Description                                                                |
| --------------- | ----------- | ------- | -------------------------------------------------------------------------- |
| selected        | `T \| null` | `null`  | The selected date.                                                         |
| startAt         | `T \| null` | `null`  | A date representing the period (month or year) to start the calendar with. |
| minDate         | `T \| null` | `null`  | The minimum valid date.                                                    |
| maxDate         | `T \| null` | `null`  | The maximum valid date.                                                    |
| showTodayButton | `boolean`   | `false` | Whether or not the today button is shown.                                  |

### Calendar Body

| Name           | Type                   | Default | Description                                                                                                                                              |
| -------------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| activeDate     | `T `                   | `today` | The date to display in this month view (everything other than the month and year is ignored).                                                            |
| startAt        | `T \| null`            | `null`  | A date representing the period (month or year) to start the calendar with.                                                                               |
| minDate        | `T \| null`            | `null`  | The minimum valid date.                                                                                                                                  |
| maxDate        | `T \| null`            | `null`  | The maximum valid date.                                                                                                                                  |
| dateFilter     | `(date: T) => boolean` | `null`  | Function used to filter whether a date is selectable or not.                                                                                             |
| ariaLabelledby | `string`               | `null`  | Used for the aria-labelledby and aria-describedby properties of the calendar body. If not provided, the month and year are used as label ad description. |

## Outputs

Calendar

| Name           | Type              | Description                                     |
| -------------- | ----------------- | ----------------------------------------------- |
| selectedChange | `EventEmitter<T>` | Emits when the currently selected date changes. |

Calendar Body

| Name             | Type              | Description                                     |
| ---------------- | ----------------- | ----------------------------------------------- |
| selectedChange   | `EventEmitter<T>` | Emits when the currently selected date changes. |
| activeDateChange | `EventEmitter<T>` | Emits when a date is activated.                 |

## Properties

Datepicker

| Name        | Type      | Description                             |
| ----------- | --------- | --------------------------------------- |
| `panelOpen` | `boolean` | Returns the open or closed panel state. |

Calendar

| Name         | Type      | Description              |
| ------------ | --------- | ------------------------ |
| `activeDate` | `boolean` | Returns the active date. |

#### Methods

The following methods are on the `DtDatepicker` class:

| Name     | Description            | Return value |
| -------- | ---------------------- | ------------ |
| `open`   | Opens the datepicker   | `void`       |
| `close`  | Closes the datepicker  | `void`       |
| `toggle` | Toggles the datepicker | `void`       |

## Dark Theme

<ba-live-example name="DtExampleDatepickerDark" fullwidth themedark></ba-live-example>

## Calendar with limited date range

<ba-live-example name="DtExampleCalendarMinMax" fullwidth></ba-live-example>
