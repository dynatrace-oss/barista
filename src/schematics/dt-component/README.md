# Dynatrace Component

Adds a new component to the `@dynatrace/angular-components` library and creates
a docs page with a default example

```
ng generate @dynatrace/components-schematics:dt-component --name=my-new-component #or shorter
ng g @dynatrace/components-schematics:dtc --name=my-new-component
```

- Adds new component to the library with the correct exports
- Adds dev-app page with default example
- Optional: Adds the component to the universal kitchensink - defaults to true
- Optional: Adds the component to the ui-tests-app and creates a ui-test spec
  file. - defaults to false

The following options are available:

- universal - boolean - default: true
- ui-test - boolean - default: false

e.g.

```
ng g @dynatrace/components-schematics:dtc --name=my-new-component --universal=false --uitest=true #or
```
