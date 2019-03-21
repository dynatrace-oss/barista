---
type: "component"
---

# Alert

## Imports

You have to import the `DtAlertModule` to use the `dt-alert`:

```typescript
@NgModule({
  imports: [
    DtAlertModule,
  ],
})
class MyModule {}
```

## Initialization

To apply the dynatrace alert component, use the `<dt-alert>` element. Example:

<docs-source-example example="WarningAlertExampleComponent"></docs-source-example>

## Options & Properties

The alert component is a wrapper component that holds a `dt-icon` and some text.

| Name  | Type | Default | Description |
| --- | --- | --- | --- |
| `[severity]` | `error | warning | undefined` | `undefined` | Sets the alert severity |
| `<ng-content>` | | | The text (error/warning) message which should be displayed. |

## Examples

### Error

<docs-source-example example="ErrorAlertExampleComponent"></docs-source-example>

### Interactive example

<docs-source-example example="InteractiveAlertExampleComponent"></docs-source-example>

### Dark mode

<docs-source-example example="DarkAlertExampleComponent" themedark="true"></docs-source-example>
