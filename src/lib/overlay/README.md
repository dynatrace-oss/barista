---
type: "component"
---

# Overlay

<docs-source-example example="DefaultOverlayExampleComponent"></docs-source-example>

There are two ways to create overlays. The service `DtOverlay` and the directive `DtOverlayTrigger`.
The service can be used to apply overlays programatically or to pass components into the overlay.
The directive can be used inside the template with a templateRef as the content of the overlay.

## Imports

You have to import the `DtOverlayModule` when you want to use the `DtOverlay` service or the `DtOverlayTrigger`directive..
The `DtOverlay` service also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.

```typescript
@NgModule({
  imports: [
    DtOverlayModule,
  ],
})
class MyModule {}
```

## DtOverlayTrigger directive

The `DtOverlayTrigger` directive can be applied to any element with the `[dtOverlay]="overlay"` selector. The parameter `overlay` passed in this example is a reference to a `ng-template` that holds the content of the overlay.
Configuration can be passed to the directive with the `[dtOverlayConfig]` input. The trigger has keyboard support. It opens the overlay on `SPACE` and `ENTER` when focused. And closes the open overlay on `ESCAPE`.

```typescript
disabled: boolean 
```
Input disabled - which prevents opening an overlay on hover when true
```typescript
tabindex: number
```
Input tabindex - sets the tabindex on the trigger - by default 0;

```typescript
focus(): void 
```
Focuses the trigger.

## DtOverlayConfig

This configuration is optional and can be passed to the service `create` method or as an input to the trigger directive. 
The `DtOverlayConfig` class has the following properties: 

```typescript
pinnable: boolean
```
enables pinning of the overlay on click or by keyboard when the trigger is focused.

```typescript
originY: 'center' | 'edge'
```
The originY defines the vertical attachment point for the overlay. By default `center` is set. `edge` defines that the vertical attachment point is set to the bottom edge if the overlay fits below the origin element and the top edge otherwise.

```typescript
movementConstraint: 'xAxis' | 'yAxis'
```
The movementConstraint locks the movement of the overlay to a given axis. No constraint is set by default.

## DtOverlay service

You can get the `DtOverlay` service instance with DI in any of your components.

```typescript
...
constructor(private _dtOverlay: DtOverlay) {}
...
```

The `DtOverlay` service has the following two methods:

```typescript
create(origin: ElementRef, componentOrTemplateRef: ComponentType<T> | TemplateRef<T>, config?: DtOverlayConfig): DtOverlayRef
```
creates a overlay connected to the origin and containing the given component or templateRef. The create method returns the newly created DtOverlayRef.

```typescript
dismiss(): void
```
Dismisses the current open overlay. Can be used if the overlay needs to be dismissed programatically.

## DtOverlayRef

The DtOverlay service create method returns an instance of `DtOverlayRef`. This reference can be used to perform updates on the position, pinning the overlay or dismissing it.

```typescript
pin(value: boolean): void 
```
Either pins or unpins the overlay.

```typescript
dismiss(): void 
```
Dismisses the overlay

```typescript
updatePosition(offsetX: number, offsetY: number): void
```
Sets an offset to the overlays position. Can be used e.g. in a mousemove eventhandler to update the overlays position depending on the MouseEvent.


## Examples

<docs-source-example example="TimelineOverlayExampleComponent"></docs-source-example>

<docs-source-example example="ProgrammaticOverlayExampleComponent"></docs-source-example>
