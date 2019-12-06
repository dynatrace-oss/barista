# Formatters

For more details have a look at the [format units pattern](/patterns/units).

## Pipes

We provide various different pipes for formatting values within your templates.
Every pipe has a single responsibility and they can be chained together to
achieve combined formats.

### Count

The `dtCount` pipe provides a way to display numbers in common way, abbreviating
big numbers and adjusting precision

<ba-live-example name="DtExampleFormattersCount"></ba-live-example>

### Percent

The `dtPercent` pipe provides a way to display percents in common way, adjusting
precision

<ba-live-example name="DtExampleFormattersPercent"></ba-live-example>

### Bits

The `dtBits` pipe provides a way to format numbers as bits

<ba-live-example name="DtExampleFormattersBits"></ba-live-example>

### Bytes

The `dtBytes` pipe provides a way to display bytes in automatic units depending
on the size of the number. The `dtKilobytes` pipe provides a way to display
bytes as kB The `dtMegabytes` pipe provides a way to display bytes as MB

<ba-live-example name="DtExampleFormattersBytes"></ba-live-example>

### Rate

The `dtRate` pipe provides a way to add a rate info to the value

<ba-live-example name="DtExampleFormattersRate"></ba-live-example>

### Time

The `dtTime` pipe provides a way to format a input time to a timestamp

<ba-live-example name="DtExampleFormattersTime"></ba-live-example>

## Util functions

Since pipes are only used within templates we provide util functions that can be
used in typescript as well to apply the correct format to numbers. These
functions return `DtFormattedValue`.

`DtFormattedValue` stores source values and also contains ready-to-display
fields, which are described in a table below:

| Name              | Type                 | Default     | Description                                                                                   |
| ----------------- | -------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `displayValue`    | `string | undefined` | `undefined` | value to be displayed                                                                         |
| `displayUnit`     | `string | undefined` | `undefined` | unit representation to be displayed                                                           |
| `displayRateUnit` | `string | undefined` | `undefined` | rate unit representation to be displayed                                                      |
| `toString()`      |                      | `-`         | method returning formatted combination of `displayValue`, `displayUnit` and `displayRateUnit` |

### Count

The `formatCount` function provides a way to format numbers as abbreviations
outside the template. The function takes the following parameters:

| Name        | Type                        | Default      | Description                                                                                                                     |
| ----------- | --------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| `input`     | `DtFormattedValue | number` |              | numeric value to be transformed by the pipe                                                                                     |
| `inputUnit` | `DtUnit | string`           | `Unit.COUNT` | input unit, if not default - displayed together with the formatted value; does not yet support plurals and internationalization |

### Percent

The `formatPercent` function provides a way to format percents, adjusting
precision outside the template. The function takes the following parameters:

| Name    | Type     | Default | Description                                 |
| ------- | -------- | ------- | ------------------------------------------- |
| `input` | `number` |         | numeric value to be transformed by the pipe |

### Bits

The `formatBits` function provides a way to format the input as bits. You can
adjust the factor used and specify the unit the input is defined in. Optional
options for the function can be passed as a `DtNumberFormaterOption`. The
options passed are internally merged with default options. The function takes
the following parameters:

| Name      | Type                        | Default | Description                                 |
| --------- | --------------------------- | ------- | ------------------------------------------- |
| `input`   | `DtFormattedValue | number` |         | numeric value to be transformed by the pipe |
| `options` | `DtNumberFormatterOption`   |         | options for the util function               |

You can specify the following properties on your options:

| Name         | Type     | Default       | Description                                                                                                                |
| ------------ | -------- | ------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `factor`     | `number` | 1000          | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit                |
| `inputUnit`  | `DtUnit` | `DtUnit.Bits` | input unit, typically defined unit of type DtUnit (DtUnit.BITS by default)                                                 |
| `outputUnit` | `DtUnit` |               | defines the unit used in the output. e.g. if you pass 10 000 000 bits and choose kilobits as the outputUnit - 10 000 kbits |

### Bytes

For bytes we provide the `formatBytes` function to format the input as bytes.
You can adjust the factor used and specify the unit the input is defined in.
Optional options for the function can be passed as a `DtNumberFormaterOption`.
The options passed are internally merged with default options. The function
takes the following parameters:

| Name        | Type                        | Default | Description                                                                                                 |
| ----------- | --------------------------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `input`     | `DtFormattedValue | number` |         | numeric value to be transformed by the pipe                                                                 |
| `factor`    | `number`                    |         | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit |
| `inputUnit` | `DtUnit`                    |         | input unit, typically defined unit of type DtUnit (DtUnit.BYTES by default)                                 |

You can specify the following properties on your options:

| Name         | Type     | Default        | Description                                                                                                                  |
| ------------ | -------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `factor`     | `number` | 1000           | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit                  |
| `inputUnit`  | `DtUnit` | `DtUnit.BYTES` | input unit, typically defined unit of type DtUnit (DtUnit.BYTES by default)                                                  |
| `outputUnit` | `DtUnit` |                | defines the unit used in the output. e.g. if you pass 10 000 000 bytes and choose kilobytes as the outputUnit - 10 000 kbits |

### Rate

The `formatRate` function enables you to format a number or a FormattedValue
from a previous pipe with a rate. The function takes the following parameters:

| Name       | Type                        | Default | Description                                 |
| ---------- | --------------------------- | ------- | ------------------------------------------- |
| `input`    | `DtFormattedValue | number` |         | numeric value to be transformed by the pipe |
| `rateUnit` | `DtRateUnit | string`       |         | rate unit                                   |

### Time

The `formatTime` function converts a number to a timestamp. Default behaviour
will print the first available value/unit and only the next two descending
steps. Optionally you can set the input unit and which unit you want to set as
the lower limit.

| Name        | Type         | Default     | Description                                                                                                    |
| ----------- | ------------ | ----------- | -------------------------------------------------------------------------------------------------------------- |
| `input`     | `number`     | `ms`        | numeric value to be transformed by the pipe                                                                    |
| `inputUnit` | `DtTimeUnit` | `undefined` | Which timeunit is used for the input                                                                           |
| `toUnit`    | `DtTimeUnit` | `undefined` | Which timeunit is the smallest possible output (Pipe disregards toUnit when unit is bigger than the inputUnit) |

## Special uses (e.g. infographics, tiles)

It is possible to display (and style) value and unit separately - just use
appropriate formatter util function that would return DtFormattedValue. You can
either call toString() method to get simple string or get its `displayData`
which contains ready-to-display fields that can be displayed separately.
