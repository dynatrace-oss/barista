---
type: "component"
---

# Expandable section

This Angular component provides basic expand/collapse functionality with a header. It has to contain
a `<dt-expandable-section-header>` which contains the header content.

## Imports

You have to import the `DtExpandableSectionModule` when you want to use the `dt-expandable-section`. 
The `dt-expandable-section` component also requires Angular's `BrowserAnimationsModule` for animations. For more details on this see *Step 2: Animations* in the Getting started Guide.

```typescript

@NgModule({
  imports: [
    DtExpandableSectionModule,
    BrowserAnimationsModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the dynatrace expandable panel, use the `<dt-expandable-section>` element. Example:

<docs-source-example example="DefaultExpandableSectionExampleComponent"></docs-source-example>

| Attribute | Description |
| --- | --- |
| `dt-expandable-section` | The expandable section |
| `dt-expandable-section-header` | The component which contains the content of the header. |

## Options & Properties

### Expandable section description

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `[opened]` | `boolean` | `false` | Sets or gets the opened state |
| `[disabled]` | `boolean` | `false` | Sets or gets the disabled state |
| `(openedChange)` | `event<boolean>` |  | Emits an event when the expanded state changes. |
| `toggle` | `boolean` |  | Toggles the expanded state, i.e. changes it to expanded, if collapsed, or vice-versa |
| `open` | `void` |  | Expands the section |
| `close` | `void` |  | Collapses the section |

## Examples

### Open state by default

<docs-source-example example="OpenExpandableSectionExampleComponent"></docs-source-example>

### Disabled

<docs-source-example example="DisabledExpandableSectionExampleComponent"></docs-source-example>

### Interactive

<docs-source-example example="InteractiveExpandableSectionExampleComponent"></docs-source-example>
