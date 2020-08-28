# fluid-design-system-provider

This is an experimental component that provides design tokens to child
components. Since it sets up default styles required It registers itself as the
`fluid-design-system-provider` custom element.

## Properties

| Property        | Attribute        | Type                              | Default     | Description                                     |
| --------------- | ---------------- | --------------------------------- | ----------- | ----------------------------------------------- |
| `theme`         | `theme`          | `'abyss' \| 'surface'`            | "'abyss'"   | Defines the theme for all child components.     |
| `layoutDensity` | `layout-density` | `'default' \| 'dense' \| 'loose'` | "'default'" | Defines the layout density inside the provider. |

## Slots

| Name | Description                                                |
| ---- | ---------------------------------------------------------- |
|      | The default slot displays the content inside the provider. |
