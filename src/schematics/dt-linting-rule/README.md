# Dynatrace Linting Rule

Adds a new linting rule to the `@dynatrace/angular-components` library.

```
ng generate @dynatrace/components-schematics:dt-linting-rule --name=my-new-verification # or shorter
ng g @dynatrace/components-schematics:dtl --name=my-new-verification
```

The following options are available:

| Name       | Type     | Default     | Description                                                                                                                  |
| ---------- | -------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `category` | `string` | `undefined` | Creates a subdirectory named `category` in the rules directory and places the rule implementation there.                     |
| `severity` | `string` | `undefined` | The only supported value is `'warning'` - if set, the rule will not fail the build but simply log a warning message instead. |

e.g.

```
ng g @dynatrace/components-schematics:dtl --name=my-new-verification --category=my-component --severity=warning
```
