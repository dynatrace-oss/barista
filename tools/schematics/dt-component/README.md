# Dynatrace Component

Adds a new component to the `@dynatrace/angular-components` library with the
correct exports and creates a dev-app page and a docs page with a default
example.

```
ng generate @dynatrace/components-schematics:dt-component --name=my-new-component #or shorter
ng g @dynatrace/components-schematics:dtc --name=my-new-component
```

The following options are available:

| Name        | Type      | Default | Description                                                             |
| ----------- | --------- | ------- | ----------------------------------------------------------------------- |
| `universal` | `boolean` | `true`  | Adds the component to the universal kitchen sink.                       |
| `uitest`    | `boolean` | `true`  | Adds the component to the ui-tests-app and creates a ui-test spec file. |

e.g.

```
ng g @dynatrace/components-schematics:dtc --name=my-new-component --universal=false --uitest=true
```
