---
type: 'component'
---

# Expandable section

This Angular component provides basic expand/collapse functionality based on the
[expandable panel](***REMOVED***
but contains a header (`<dt-expandable-section-header>`), which is the trigger
of the expandable panel.

## Imports

You have to import the `DtExpandableSectionModule` when you want to use the
`dt-expandable-section`. The `dt-expandable-section` component also requires
Angular's `BrowserAnimationsModule` for animations. For more details on this see
[_Step 2: Animations_](***REMOVED***
in the getting started guide.

```typescript
@NgModule({
  imports: [DtExpandableSectionModule, BrowserAnimationsModule],
})
class MyModule {}
```

## Initialization

To apply the Dynatrace expandable panel, use the `<dt-expandable-section>`
element.

| Attribute                      | Description                                              |
| ------------------------------ | -------------------------------------------------------- |
| `dt-expandable-section`        | The expandable section.                                  |
| `dt-expandable-section-header` | The component, which contains the content of the header. |

<docs-source-example example="ExpandableSectionDefaultExample"></docs-source-example>

## Options & Properties

## Inputs

| Name       | Type      | Default | Description                                |
| ---------- | --------- | ------- | ------------------------------------------ |
| `expanded` | `boolean` | `false` | Sets or gets the section's expanded state. |
| `disabled` | `boolean` | `false` | Sets or gets the section's disabled state. |

## Outputs

| Name           | Type                   | Description                                     |
| -------------- | ---------------------- | ----------------------------------------------- |
| `expandChange` | `Observable<boolean>`  | Emits an event when the expanded state changes. |
| `expanded`     |  `Observable<boolean>` |  Event emitted when the panel is expanded.      |
| `collapsed`    |  `Observable<boolean>` |  Event emitted when the panel is collapsed.     |

## Properties

| Name     | Type      | Description                                                                          |
| -------- | --------- | ------------------------------------------------------------------------------------ |
| `toggle` | `boolean` | Toggles the expanded state, i.e. changes it to expanded if collapsed, or vice-versa. |
| `open`   | `void`    | Expands the panel.                                                                   |
| `close`  | `void`    | Collapses the panel.                                                                 |

## Examples

### Open state by default

<docs-source-example example="ExpandableSectionOpenExample"></docs-source-example>

### Disabled

<docs-source-example example="ExpandableSectionDisabledExample"></docs-source-example>

### Interactive

<docs-source-example example="ExpandableSectionInteractiveExample"></docs-source-example>

### Dark background

<docs-source-example example="ExpandableSectionDarkExample" themedark="true"></docs-source-example>
