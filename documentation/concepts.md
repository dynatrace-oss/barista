# Concepts

## UI Testing

### Propagating Attributes to Component Overlays

In order to test the overlays of the Barista components you'll have to provide
the `DT_UI_TEST_CONFIG` Token into your application's module. You can use the
default configuration `DT_DEFAULT_UI_TEST_CONFIG` which will set the attribute's
value to `[attribute-value]-overlay-[index]`.

#### Example: Providing in app.module with default configuration

```ts
@NgModule({
  imports: [BrowserModule],
  declaration: [AppComponent],
  providers: [
    {
      provide: DT_UI_TEST_CONFIG, useValue: DT_DEFAULT_UI_TEST_CONFIG
    }
  ]
  bootstrap: [AppComponent]
})
```

#### Example: Providing in app.module with custom configuration

You can provide your own custom configuration. Use the interface
`DtUiTestConfiguration` for that.

```ts
const customUiTestConfig: DtUiTestConfiguration = {
  attributeName: 'testid',
  constructOverlayAttributeValue(attributeName: string): string {
    return `${attributeName}-overlay`
  }
}

@NgModule({
  imports: [BrowserModule],
  declaration: [AppComponent],
  providers: [
    {
      provide: DT_UI_TEST_CONFIG, useValue: customUiTestConfig
    }
  ]
  bootstrap: [AppComponent]
})
```
