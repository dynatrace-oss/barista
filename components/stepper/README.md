# Stepper

The stepper component creates a multi step workflow by creating a content area
for each step provided.

<ba-live-example name="DtExampleStepperDefault" fullwidth></ba-live-example>

A step can have multiple states during the workflow. One step at a time can be
selected. Steps can be active or inactive depending if they were interacted with
in the past. If a step has a stepControl associated, the step gets completed as
soon as the stepControl is valid. Otherwise a step becomes completed as soon as
it becomes active.

## Imports

You have to import the `DtStepperModule` when you want to use the `dt-stepper`
and the `dt-step`:

```typescript
@NgModule({
  imports: [DtStepperModule],
})
class MyModule {}
```

## Initialization

To use the stepper component add the `dt-stepper` component and multiple
`dt-step` components as content children to the `dt-stepper`.

## DtStepper

The `dt-stepper` component handles which step is active and therefore what
content needs to be shown. It also handles correct keyboard and focus management
for the steps. By default the steps don't have to be completed in order. This
can be changed by setting the `linear` Input to true. You have two options to
handle validation for steps. You can use a single form for all steps - note that
you have to set the `type` Input on the `dtStepperNext` and `dtStepperPrevious`
directives to `button`. Otherwise the form gets submitted on the first click.
When using multiple forms the validity of each form can used to validate the
step's completion status. You can attach the form to the step by passing the
formControl to the `stepControl` Input on the step.

### Inputs

| Name            | Type      | Default | Description                                                                              |
| --------------- | --------- | ------- | ---------------------------------------------------------------------------------------- |
| `linear`        | `boolean` | `false` | Whether the user can continue to the next step even if the current step is not completed |
| `selected`      | `DtStep`  |         | The step that is selected                                                                |
| `selectedIndex` | `number`  |         | The index of the selected step                                                           |

### Outputs

| Name              | Type                                  | Description                                  |
| ----------------- | ------------------------------------- | -------------------------------------------- |
| `selectionChange` | `EventEmitter<StepperSelectionEvent>` | Event emitted when the selected step changed |

### Methods

| Name       | Return value | Description                              |
| ---------- | ------------ | ---------------------------------------- |
| `next`     | `void`       | Selects and focuses the next step        |
| `previous` | `void`       | Selects and focuses the previous step    |
| `reset`    | `void`       | Resets the stepper to it's initial state |

## DtStep

With the `dt-step` component you can create a step inside the stepper. You can
provide the content that will be shown when the step is active as ng-content
between the tags of the `dt-step`. If the `dt-stepper` is set to linear, each
step has to be completed before advancing to the next step. If this is not
desired for a step, the `optional` Input can be used and set to false to make a
step optional. Steps that are set to editable by the `editable` Input can be
changed after they are set to completed.

### Inputs

| Name              | Type              | Default                                         | Description                                             |
| ----------------- | ----------------- | ----------------------------------------------- | ------------------------------------------------------- |
| `aria-label`      | `string`          |                                                 | The aria label used for the step                        |
| `aria-labelledby` | `string`          |                                                 | The id of the element the step is labelled by           |
| `completed`       | `boolean`         | `false`                                         | Whether the step is completed                           |
| `editable`        | `boolean`         | `true`                                          | Whether a user can return to an already completed step  |
| `label`           | `string`          |                                                 | A string only label used for the step                   |
| `completed`       | `boolean`         | `false`                                         | Whether the step is completed                           |
| `optional`        | `boolean`         | `false`                                         | Whether completion of the step is optional              |
| `state`           | `StepState`       | `'number' | 'edit' | 'done' | 'error' | string` | State of the step                                       |
| `stepControl`     | `FormControlLike` |                                                 | Control of the step that is used to validate completion |

### Methods

| Name     | Return value | Description                           |
| -------- | ------------ | ------------------------------------- |
| `select` | `void`       | Selects the step                      |
| `reset`  | `void`       | Resets the step to it's initial state |

For complex step labels we provide a directive `dtStepLabel` that can be used to
specify a label that contains markdown.

```
<dt-step>
<ng-template dtStepLabel>My label with an icon <dt-icon name="agent"></dt-icon></ng-template>
</dt-step>
```

To apply the proper spacing, alignment and behaviour for next and previous
buttons for the stepper there are a couple of directives that you can use.

## DtStepActions

You can use the `dt-step-actions` directive in your template to group the next
and previous buttons and align them correctly.

## DtStepperPrevious & DtStepperNext

The `dtStepperPrevious` and `dtStepperNext` directives can be applied to
`dt-button` elements and provide an easy way to handle the transition from one
step to another in the workflow. These two directives default the type of the
button to `submit`.

## Stepper in use

### Linear stepper

A stepper that is set to be linear. So each step has to be valid before the next
step can be activated.

<ba-live-example name="DtExampleStepperLinear" fullwidth></ba-live-example>

### Editable steps

A stepper where steps can be edited after they have been completed.

<ba-live-example name="DtExampleStepperEditable" fullwidth></ba-live-example>
