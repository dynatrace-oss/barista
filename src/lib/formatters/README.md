# Formatters

## Pipes

We provide various different pipes for formatting values within your templates. Every pipe has a single responsibility and they can be chained together to achieve combined formats.

### Count

The `dtCount` pipe provides a way to display numbers in common way, abbreviating big numbers and adjusting precision

<docs-source-example example="CountExample"></docs-source-example>

### Percent

The `dtPercent` pipe provides a way to display percents in common way, adjusting precision

<docs-source-example example="PercentExample"></docs-source-example>

### Bits

The `dtBits` pipe provides a way to format numbers as bits

<docs-source-example example="BitsExample"></docs-source-example>

### Bytes

The `dtBytes` pipe provides a way to display bytes in automatic units depending on the size of the number.
The `dtKilobytes` pipe provides a way to display bytes as kB 
The `dtMegabytes` pipe provides a way to display bytes as MB  

<docs-source-example example="BytesExample"></docs-source-example>

### Rate 

The `dtRate` pipe provides a way to add a rate info to the value

<docs-source-example example="RateExample"></docs-source-example>

## Util functions

Since pipes are only used within templates we provide util functions that can be used in typescript as well to apply the correct format to numbers.
These functions return `DtFormattedValue`.

`DtFormattedValue` stores source values and also contains ready-to-display fields, which are described in a table below:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `displayValue` | `string | undefined` | `undefined` | value to be displayed |
| `displayUnit` | `string | undefined` | `undefined` | unit representation to be displayed |
| `displayRateUnit` | `string | undefined` | `undefined` | rate unit representation to be displayed |
| `toString()` |  | `-` | method returning formatted combination of `displayValue`, `displayUnit` and `displayRateUnit`  |

### Count

The `formatCount` function provides a way to format numbers as abbreviations outside the template.
The function takes the following parameters: 
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `DtFormattedValue | number` | | numeric value to be transformed by the pipe |
| `inputUnit` | `DtUnit | string` | `Unit.COUNT` | input unit, if not default - displayed together with the formatted value; does not yet support plurals and internationalization |

### Percent

The `formatPercent` function provides a way to format percents, adjusting precision outside the template.
The function takes the following parameters:
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `number` | | numeric value to be transformed by the pipe |

### Bits

The `formatBits` function provides a way to format the input as bits. You can adjust the factor used and specify the unit the input is defined in.
Optional options for the function can be passed as a `DtNumberFormaterOption`. The options passed are internally merged with default options. 
The function takes the following parameters:
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `DtFormattedValue | number` | | numeric value to be transformed by the pipe |
| `options` | `DtNumberFormatterOption` | | options for the util function

You can specify the following properties on your options:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `factor` | `number` | 1000 | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit |
| `inputUnit` | `DtUnit` | `DtUnit.Bits` | input unit, typically defined unit of type DtUnit (DtUnit.BITS by default) |
| `outputUnit` | `DtUnit` | | defines the unit used in the output. e.g. if you pass 10 000 000 bits and choose kilobits as the outputUnit - 10 000 kbits |

### Bytes

For bytes we provide the `formatBytes` function to format the input as bytes. You can adjust the factor used and specify the unit the input is defined in.
Optional options for the function can be passed as a `DtNumberFormaterOption`. The options passed are internally merged with default options. 
The function takes the following parameters:
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `DtFormattedValue | number` | | numeric value to be transformed by the pipe |
| `factor` | `number` | | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit |
| `inputUnit` | `DtUnit` | | input unit, typically defined unit of type DtUnit (DtUnit.BYTES by default) |

You can specify the following properties on your options:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `factor` | `number` | 1000 | determines whether to use KILO (default) or KIBI multiplier in calculations; does not affect displayed unit |
| `inputUnit` | `DtUnit` | `DtUnit.BYTES` | input unit, typically defined unit of type DtUnit (DtUnit.BYTES by default) |
| `outputUnit` | `DtUnit` | | defines the unit used in the output. e.g. if you pass 10 000 000 bytes and choose kilobytes as the outputUnit - 10 000 kbits |

### Rate

The `formatRate` function enables you to format a number or a FormattedValue from a previous pipe with a rate. 
The function takes the following parameters:
| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `DtFormattedValue | number` | | numeric value to be transformed by the pipe |
| `rateUnit` | `DtRateUnit | string` | | rate unit |

## Special uses (e.g. infographics, tiles)
It is possible to display (and style) value and unit separately - just use appropriate formatter util function that would return DtFormattedValue.
You can either call toString() method to get simple string or get its `displayData` which contains ready-to-display fields that can be displayed separately. 

