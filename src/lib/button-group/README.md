# ButtonGroup

{{component-demo name="ButtonGroupDefaultExampleComponent" }}

This component create a button group elements with Dynatrace styling.

## Imports

You have to import the `DtButtonGroupModule` when you want to use the `dt-button-group`

```typescript
@NgModule({
  imports: [
    DtButtonGroupModule,
  ],
}
class MyModule {}
```

## Initialization

To apply the dynatrace button group, use the `&lt;dt-button-group&gt;` and `&lt;dt-button-group-item&gt;` elements.

*Example:*

| Attribute               | Description                                                                                                                |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `dt-button-group`       | Indicate the outer element of the button group. The group element can contain multiple `<dt-button-group-item>` elements.  |
| `dt-button-group-item`  | The element of an individual button.                                                                                       |

## Options & Properties

#### Button group

<table class="table">
  <thead>
  <tr>
    <td width="160px">Name</td>
    <td width="250px">Type</td>
    <td width="160px">Default</td>
    <td>Description</td>
  </tr>
  </thead>
  <tbody>

  <tr>
    <td><code>[value]</code></td>
    <td><code>T | undefined</code></td>
    <td><code>undefined</code></td>
    <td>Gets sets the current value</td>
  </tr>
  <tr>
    <td><code>[disabled]</code></td>
    <td><code>boolean | undefined</code></td>
    <td><code>undefined</code></td>
    <td>Sets disable state if property is set and the value is truthy or undefined</td>
  </tr>
  <tr>
    <td><code>[tabIndex]</code></td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>Sets and gets the tabIndex property</td>
  </tr>
  <tr>
    <td><code>(valueChange)</code></td>
    <td><code>event&lt;T&gt;</code></td>
    <td><code></code></td>
    <td>Emits an event when the user selects an other button.</td>
  </tr>
  </tbody>
</table>

#### Button group item

<table class="table">
  <thead>
  <tr>
    <td width="160px">Name</td>
    <td width="250px">Type</td>
    <td width="160px">Default</td>
    <td>Description</td>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td><code>&lt;ng-content&gt;</code></td>
    <td><code></code></td>
    <td><code></code></td>
    <td>The content/text which is displayed inside of the item</td>
  </tr>
  <tr>
    <td><code>[value]</code></td>
    <td><code>T | undefined</code></td>
    <td><code>undefined</code></td>
    <td>The associated value of this item</td>
  </tr>
  <tr>
    <td><code>[disabled]</code></td>
    <td><code>boolean | undefined</code></td>
    <td><code>undefined</code></td>
    <td>Sets disable state if property is set and the value is truthy or undefined</td>
  </tr>
  <tr>
    <td><code>[tabIndex]</code></td>
    <td><code>number</code></td>
    <td><code>0</code></td>
    <td>Sets and gets the tabIndex property</td>
  </tr>
  <tr>
    <td><code>[selected]</code></td>
    <td><code>boolean</code></td>
    <td><code>false</code></td>
    <td>Sets or gets the selected state of this item</td>
  </tr>
  <tr>
    <td><code>[color]</code></td>
    <td><code>string | undefined</code></td>
    <td><code>undefined</code></td>
    <td>Sets color. Possible options:
      <ul>
        <li><code>main</code> (default)</li>
        <li><code>error</code></li>
      </ul></td>
  </tr>
  </tbody>
</table>

## Examples

### Group disabled

{{component-demo name="ButtonGroupDisabledExampleComponent" }}

### Item disabled

{{component-demo name="ButtonGroupItemDisabledExampleComponent" }}

### Error state

{{component-demo name="ButtonGroupErrorExampleComponent" }}

### Interactive example

{{component-demo name="ButtonGroupInteractiveExampleComponent" }}

### Dark example

{{component-demo name="ButtonGroupDarkExampleComponent" themedark="true"}}
