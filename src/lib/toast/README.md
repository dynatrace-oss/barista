# Toast

<docs-source-example example="DefaultToastExampleComponent"></docs-source-example>

## Imports

You have to import the `DtToastModule` when you want to use the `DtToast` service:

```typescript
@NgModule({
  imports: [
    DtToastModule,
  ],
})
class MyModule {}
```

## Initialization

You can get the `DtToast` instance with DI in any of your components. The `DtToast` ensures that there is only one toast open at one time.

```typescript
...
constructor(private _dtToast: DtToast) {}
...
```

## Methods

The `DtToast` service has the following two methods:

```typescript
create(message: string): DtToastRef
```
creates a new toast with the given message and returns the ref to the created toast. The toast duration is calculated based on the message length and gets dismissed automatically after the time passed.

```typescript
dismiss(ref: DtToastRef): void
```
Dismisses the toast for the given ref. Can be used if a toast needs to be dismissed before the calculated time passes.

## Examples

<docs-source-example example="DynamicMsgToastExampleComponent"></docs-source-example>