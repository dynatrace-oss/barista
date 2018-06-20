# Expandable section

This Angular component provides basic expand/collapse functionality with a header.
A `<dt-expandable-section>` element should be used whenever some action is performed. It has to contain
a `<dt-expandable-section-header>` which contains the header content.

Animation is done using Angular animations. So, don't forget
to provide the animations module, too.

## Imports

You have to import the `DtExpandableSectionModule` when you want to use the `dt-expandable-section`:

```typescript

@NgModule({
  imports: [
    DtExpandableSectionModule,
  ],
})
class MyModule {}

```

## Initialization

To apply the dynatrace expandable panel, use the `<dt-expandable-section>` element. Example:

{{component-demo name="DefaultExpandableSectionExampleComponent"}}

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

{{component-demo name="OpenExpandableSectionExampleComponent"}}

### Disabled

{{component-demo name="DisabledExpandableSectionExampleComponent"}}

### Interactive

{{component-demo name="InteractiveExpandableSectionExampleComponent"}}
