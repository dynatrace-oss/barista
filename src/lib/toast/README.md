---
type: 'component'
---

# Toast

The `DtToast` service provides the possibility to show a temporary message to the user. The duration the toast is shown is calculated based on the message length. Dismissing the toast is paused while the user is hovering the message.

## Imports

You have to import the `DtToastModule` when you want to use the `DtToast` service.
The `DtToast` service component also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see _Step 2: Animations_ in the Getting started Guide.

```typescript
@NgModule({
  imports: [DtToastModule],
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
create(message: string): DtToastRef | null
```

creates a new toast with the given message and returns the ref to the created toast. The toast duration is calculated based on the message length and gets dismissed automatically after the time passed. If the message is empty no toast will be created and `null` is returned.

```typescript
dismiss(): void
```

Dismisses the currently displayed toast. Can be used if a toast needs to be dismissed before the calculated time passes.

## Examples

### Default

<docs-source-example example="ToastDefaultExample"></docs-source-example>

### Dynamic message

<docs-source-example example="ToastDynamicMsgExample"></docs-source-example>
