# Formatters

## Output - FormattedValue

Most formatters return `FormattedValue`.
`FormattedValue` stores source values and also contains ready-to-display fields, which are described in a table below:

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `displayValue` | `string | undefined` | `undefined` | value to be displayed |
| `displayUnit` | `string | undefined` | `undefined` | unit representation to be displayed |
| `displayRateUnit` | `string | undefined` | `undefined` | rate unit representation to be displayed |
| `toString()` | `string` | `-` | method returning formatted combination of `displayValue`, `displayUnit` and `displayRateUnit`  |

### Standard use (pipe in template)
Using pipe in template does not require calling `toString()` method.

### Special uses (e.g. infographics, tiles)
It is possible to display (and style) value and unit separately - just inject pipe in your `*.ts` file and use ready-to-display fields of returned `FormattedValue` in any way you need.  

## Count formatter

`dtCount` provides a way to display numbers in common way, abbreviating big numbers and adjusting precision

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `number` | | numeric value to be transformed by the pipe |
| `inputUnit` | `DtUnit | string` | `Unit.COUNT` | input unit, if not default - displayed together with the formatted value; does not yet support plurals and internationalization |
| `inputRateUnit` | `DtRateUnit | string | undefined` | `undefined` | additional information about possible rate unit; does not cause rate to be displayed, value is used only as a reference in case an additional rate pipe is used |

<docs-source-example example="CountPipeExample"></docs-source-example>


## Percent formatter

`dtPercent` provides a way to display percents in common way, adjusting precision

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `number` | | numeric value to be transformed by the pipe |

<docs-source-example example="PercentPipeExample"></docs-source-example>

## Rate 

`dtRate` provides a way to add a rate info to the value

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `input` | `number | FormattedValue` | | numeric value to be transformed by the pipe |
| `rateUnit` | `DtRateUnit | string` | | rate unit |

<docs-source-example example="RatePipeExample"></docs-source-example>
