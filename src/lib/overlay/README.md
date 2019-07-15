---
type: 'component'
---

# Overlay

The overlay component is used to display additional context information or to
analyze charts, tags or tiles. The overlay's content should be reduced to a
minimal amount of necessary components to display further information and
actions.

There are two ways to create overlays: using the `DtOverlay` service or the
`DtOverlayTrigger` directive. The service can be used to apply overlays
programatically or to pass components into the overlay. The directive can be
used inside the template with a `templateRef` as the content of the overlay. The
following basic example uses the `DtOverlay` service and passes an optional
configuration (find details below) to the overlay.

<docs-source-example example="OverlayDefaultExample"></docs-source-example>

## Imports

You have to import the `DtOverlayModule` when you want to use the `DtOverlay`
service or the `DtOverlayTrigger`directive. The `DtOverlay` service also
requires Angular's `BrowserAnimationsModule` for animations. For more details on
this see
[_Step 2: Animations_ in the getting started guide](/components/get-started/#step-2-animations).

```typescript
@NgModule({
  imports: [DtOverlayModule],
})
class MyModule {}
```

## DtOverlayTrigger directive

The `DtOverlayTrigger` directive can be applied to any element with the
`[dtOverlay]="overlay"` attribute. The parameter `overlay` passed in this
example is a reference to an `ng-template` that holds the content of the
overlay. The configuration can be passed to the directive using the
`[dtOverlayConfig]` input (see properties below).

The trigger has keyboard support: It opens the overlay on `SPACE` and `ENTER`
when focused and closes the open overlay on `ESCAPE`.

When an overlay is active and the trigger gets destroyed, the overlay will be
dismissed as well.

### Options & properties

| Name                       | Type               | Default | Description                                                      |
| -------------------------- | ------------------ | ------- | ---------------------------------------------------------------- |
| `@Input() disabled`        | `boolean`          | `-`     | When disabled is set to true the overlay does not open on hover. |
| `@Input() tabIndex`        |  `number`          |  `0`    |  Sets the trigger's tabindex.                                    |
| `@Input() dtOverlay`       | `TemplateRef`      |  -      | Overlay pane containing the content.                             |
| `@Input() dtOverlayConfig` | `DtOverlayConfig`  | -       | Overlay configuration; see properties below.                     |
| `focus()`                  | `void`             |         |  Focuses the trigger.                                            |

## DtOverlay service

You can get the `DtOverlay` service instance with DI in any of your components.

```typescript
...
constructor(private _dtOverlay: DtOverlay) {}
...
```

The `DtOverlay` service has the following two methods:

| Method      | Parameters                                                                                                        | Return value                       | Description                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `create()`  | `origin: ElementRef`<br>`componentOrTemplateRef: ComponentType<T> | TemplateRef<T>`<br>`config?: DtOverlayConfig` | `DtOverlayRef` (see details below) | Creates a overlay connected to the origin and containing the given component or templateRef.                         |
| `dismiss()` |  -                                                                                                                |  `void`                            |  Dismisses the currently open overlay. This method can be used if the overlay needs to be dismissed programatically. |

### DtOverlayRef

The DtOverlay service `create` method returns an instance of `DtOverlayRef`.
This reference can be used to perform updates on the position, pinning the
overlay or dismissing it.

| Method             | Parameters                               | Return value | Description                                                                                                                                          |
| ------------------ | ---------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pin()`            | `value: boolean`                         |  `void`      | Either pins or unpins the overlay.                                                                                                                   |
| `dismiss()`        | -                                        |  `void`      | Dismisses the overlay.                                                                                                                               |
| `updatePosition()` | `offsetX: number` <br> `offsetY: number` |  `void`      | Sets an offset to the overlay's position. Can be used e.g. in a mousemove eventhandler to update the overlays position depending on the MouseEvent.  |

## DtOverlayConfig

This configuration is optional and can be passed to the service's `create`
method or as an input to the trigger directive. The `DtOverlayConfig` class has
the following properties:

| Name                 | Type             | Default  | Description                                                                                                                                                                                                                                         |
| -------------------- | ---------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pinnable`           | `boolean`        | `-`      | enables pinning of the overlay on click or by keyboard when the trigger is focused.                                                                                                                                                                 |
| `originY`            | `center | edge`  | `center` | The originY defines the vertical attachment point for the overlay. By default `center` is set. `edge` defines that the vertical attachment point is set to the bottom edge if the overlay fits below the origin element and the top edge otherwise. |
| `movementConstraint` |  `xAxis | yAxis` | -        | The movementConstraint locks the movement of the overlay to a given axis. No constraint is set by default.                                                                                                                                          |

## Examples

### Timeline overlay

<docs-source-example example="OverlayTimelineExample"></docs-source-example>

### Programmatic overlay

<docs-source-example example="OverlayProgrammaticExample"></docs-source-example>
