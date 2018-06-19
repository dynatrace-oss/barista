# Alert

## Imports

You have to import the `DtAlertModule` when you want to use the `dt-alert`:

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

{{component-demo name="WarningAlertExampleComponent" }}

| Attribute        | Description    |
| ---------------- | -------------- |
| `dt-alert`       | The component  |

## Options & Properties

| Name  | Type | Default | Description |
| --- | --- | --- | --- |
| `[severity]` | `error | warning | undefined` | `undefined` | Sets the alert severity |
| `<ng-content>` | | | The text (error/warning) message which should be displayed. |

## Examples

### Longer text

{{component-demo name="DefaultAlertExampleComponent" }}

### Error

{{component-demo name="ErrorAlertExampleComponent" }}

### Interactive example

{{component-demo name="InteractiveAlertExampleComponent" }}

### Dark mode

{{component-demo name="DarkAlertExampleComponent" }}
