# Alert

<ba-ux-snippet name="alert-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleAlertWarning"></ba-live-example>

<ba-live-example name="DtExampleAlertError"></ba-live-example>

## Imports

You have to import the `DtAlertModule` to use the `dt-alert`:

```typescript
@NgModule({
  imports: [DtAlertModule],
})
class MyModule {}
```

## Initialization

To use the alert component, add the `<dt-alert>` element to your page.

## Inputs

| Name           | Type              | Default | Description                                                 |
| -------------- | ----------------- | ------- | ----------------------------------------------------------- |
| `severity`     | `error | warning` | `error` | Sets the alert severity.                                    |
| `<ng-content>` |                   |         | The text (error/warning) message which should be displayed. |

## Variants

Depending on the value of the `severity` input an error- or warning-alert is
rendered.

<ba-live-example name="DtExampleAlertInteractive"></ba-live-example>

## Dark background

Alerts can be placed on dark background.

<ba-live-example name="DtExampleAlertDark" themedark></ba-live-example>

<ba-live-example name="DtExampleAlertDarkError" themedark></ba-live-example>

## Alerts in use

<ba-ux-snippet name="alert-in-use"></ba-ux-snippet>

## Do's and don'ts

<ba-ux-snippet name="alert-dos-donts"></ba-ux-snippet>
