---
type: "component"
---

# Drawer

<docs-source-example example="DefaultDrawerExampleComponent"></docs-source-example>

The Dynatrace Drawer is a component designed to add collapsible side content *(often navigation, though it can be any content)* alongside some primary content.

## Imports

You have to import the `DtDrawerModule` when you want to use the `<dt-drawer>` and `<dt-drawer-container>`, note that you need Angular's `BrowserAnimationsModule` if you want to have animations or the `NoopAnimationsModule` if you don't.

```typescript

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DtDrawerModule } from '@dyntrace/angular-components';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    DtDrawerModule,
  ],
})
class MyModule {}

```

To use the drawer in your template there are two tags. First of all you need the `<dt-drawer-container>` that wraps your drawer and the main content. Inside this container you can put the `<dt-drawer>` tag. Inside the drawer tag you can put the content that should be pushed to off-canvas.

## Inputs

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `mode` | `'side' | 'over'` | `'side'` | The behavior of the drawer, can overlay over or shrink the primary content. |
| `position` | `'start' | 'end'` | `'start'` | Defines if the drawer is on the left or right side in a container. *(A drawer container can only have one drawer per position)* |
| `opened` | `boolean` | `false` | The actual open state of the drawer. |

## Outputs

| Name | Type | Description |
| --- | --- | --- |
| `opened` | `Observable<void>` | Event emitted when the drawer has been opened.  |
| `closed` | `Observable<void>` | Event emitted when the drawer has been closed. |
| `openChange` | `EventEmitter<boolean>` | Emits when the drawer open state changes. Emits a boolean value for the open sate *(true for open, false for close)*. |

## Methods

The following methods are on the `DtDrawer` class:

| Name | Description | Return value |
| --- | --- | --- |
| `open` | Opens the drawer | `void` |
| `close` | Closes the drawer | `void` |
| `toggle` | toggles the drawer | `void` |

The container class `DtDrawerContainer` has follwing methods:

| Name | Description | Return value |
| --- | --- | --- |
| `open` | Opens all the drawers in the container | `void` |
| `close` | Closes all the drawers in the container | `void` |

## Examples

### Over laying mode Drawer Example

<docs-source-example example="OverDrawerExampleComponent"></docs-source-example>

### Dynamic Drawer Example

<docs-source-example example="DynamicDrawerExampleComponent"></docs-source-example>

### Nested Drawer Example

<docs-source-example example="NestedDrawerExampleComponent"></docs-source-example>
