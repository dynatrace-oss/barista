# Toast

The `DtToast` service provides the possibility to show a temporary message to
the user. The duration the toast is shown is calculated based on the message
length. Dismissing the toast is paused while the user is hovering the message.

<ba-live-example name="DtExampleToastDefault"></ba-live-example>

## Imports

You have to import the `DtToastModule` when you want to use the `DtToast`
service. The `DtToast` service component also requires Angular's
`BrowserAnimationsModule` for animations. For more details on this see
[Step 2: Animations](https://barista.dynatrace.com/components/get-started/#step-2-animations)
in the getting started guide.

```typescript
@NgModule({
  imports: [DtToastModule],
})
class MyModule {}
```

## Initialization

You can get the `DtToast` instance with dependency injection (DI) in any of your
components. The `DtToast` ensures that there is only one toast open at one time.

```typescript
...
constructor(private _dtToast: DtToast) {}
...
```

## Methods

The `DtToast` service has the following two methods:

### Create message

```typescript
create(message: string): DtToastRef | null
```

Creates a new toast with the given message and returns the ref to the created
toast. The toast duration is calculated based on the message length and gets
dismissed automatically after the time passed. If the message is empty no toast
will be created and `null` is returned.

It is crucial to show short to the point messages that can be perceived easily.
Therefore, toasts only support messages up to 120 characters. They can not
contain any actions or icons. They are not clickable.

<ba-live-example name="DtExampleToastDynamicMsg"></ba-live-example>

### Dismiss toast

```typescript
dismiss(): void
```

Dismisses the currently displayed toast. Can be used if a toast needs to be
dismissed before the calculated time passes.

## Animation

The timeframe a message is displayed depends on the number of characters.
Fade-in and fade-out animations last 150 ms.

A full animation circle consists of

- fade-in animation (f = 150ms)
- time to perceive the information (p = 500ms)
- time to read and understand the text (r \* Number of characters) (r = 50ms)
- and fade-out (f = 150ms)

Animation time = (f + p + (r \* Number of characters) + f);

As the maximum number of characters is 120, therfore, the display time of a
toast can not be longer than 6800 ms. The minumum display time is 2000ms to
guarantee that the message can be perceived by the user.
