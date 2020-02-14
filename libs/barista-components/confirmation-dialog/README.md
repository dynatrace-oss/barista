# Confirmation Dialog

<ba-ux-snippet name="confirmation-dialog-intro"></ba-ux-snippet>

<ba-live-example name="DtExampleConfirmationDialogDefault"></ba-live-example>

The `<dt-confirmation-dialog>` creates an overlay and slides a drawer up from
the bottom of the screen. The contents of the drawer display arbitrary projected
content. The content displayed is associated with the `state` input of the
component, so that it can be changed according to the validity of a form or an
unsaved change, etc.

It also supports disabling the rest of the page by adding an unclickable and
opaque overlay, forcing the user to take action on the dialog. The confirmation
dialog is part of all settings views.

## Imports

You have to import the `DtConfirmationDialogModule` when you want to use the
`DtConfirmationDialog`. The `DtConfirmationDialog` also requires Angular's
`BrowserAnimationsModule` for animations. For more details on this see
[Step 2: Animations](https://barista.dynatrace.com/components/get-started/#step-2-animations)
in the getting started guide.

```typescript
@NgModule({
  imports: [DtConfirmationDialogModule],
})
class MyModule {}
```

## Initialization

To use the confirmation dialog, add the `<dt-confirmation-dialog>` element to
the view, including content to be projected into the dialog to handle the
various states required:

```html
<dt-confirmation-dialog [state]="currentState">
  <dt-confirmation-dialog-state name="myState">
    You have pending changes.
    <dt-confirmation-dialog-actions>
      <button dt-button variant="secondary">Clear</button
      ><button dt-button>Save</button>
    </dt-confirmation-dialog-actions>
  </dt-confirmation-dialog-state>
</dt-confirmation-dialog>
```

## Inputs

### dt-confirmation-dialog

| Name           | Type            | Default | Description                                                                                    |
| -------------- | --------------- | ------- | ---------------------------------------------------------------------------------------------- |
| `state`        | `string | null` | `null`  | The name of the currently active state, or a falsey value if none are active.                  |
| `aria-label`   | `string`        |         | Accessibility label describing the dialog.                                                     |
| `showBackdrop` | `boolean`       | `false` | Whether or not to show the backdrop disabling all other page functionality besides the dialog. |

The dialog is created by supplying markup to the component, and associating each
piece of markup to particular "states" in which to display them. The component
has an @Input() (`state`) and causes it to display the appropriate markup when
that state is entered.

The other @Input() (`showBackdrop`) decides whether or not a backdrop disabling
all other page functionality besides the dialog is displayed, in order to force
the user to save or discard a change.

<ba-live-example name="DtExampleConfirmationDialogShowBackdrop"></ba-live-example>

The `dt-confirmation-dialog-actions` directive can be used to properly group
action buttons used within a `dt-confirmation-dialog-state`.

| Name              | Type            | Default     | Description                                                                                    |
| ----------------- | --------------- | ----------- | ---------------------------------------------------------------------------------------------- |
| `state`           | `string | null` | `null`      | The name of the currently active state, or a falsey value if none are active.                  |
| `aria-label`      | `string`        | `undefined` | Accessibility label describing the dialog.                                                     |
| `aria-labelledby` | `string`        | `undefined` | ARIA reference to a label describing the confirmation dialog                                   |
| `showBackdrop`    | `boolean`       | `false`     | Whether or not to show the backdrop disabling all other page functionality besides the dialog. |

To make our components accessible it is obligatory to provide either an
`aria-label` or `aria-labelledby`.

### dt-confirmation-dialog-state

| Name   | Type            | Default | Description                                                                            |
| ------ | --------------- | ------- | -------------------------------------------------------------------------------------- |
| `name` | `string | null` | `null`  | The name of the state that corresponds to this `dt-confirmation-dialog-state` element. |

## Behavior

<ba-ux-snippet name="confirmation-dialog-behavior"></ba-ux-snippet>

## Animation

<ba-ux-snippet name="confirmation-dialog-animation"></ba-ux-snippet>

## Responsiveness

The component is responsive. A "breakpoint" exists at 662px for the point at
which the dialog becomes taller, the children of the
dt-confirmation-dialog-state transition to flex wrap, and
dt-confirmation-dialog-actions are wrapped to their own line. Animations still
occur over the same duration in this state. Minimum widths can be supplied for
dt-confirmation-dialog-state children that the component will honor.
