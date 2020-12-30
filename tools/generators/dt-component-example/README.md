# Shipped schematic

This schematic generates the component for barista examples. The only needed
parameters are the name of the component and the example.

The schematic is compatible with previously added components, so if the
component already has example, a new example for that component will be
generated.

Note: the compatibility mentioned above can be only guaranteed if the original
example component was generated with this schematic, and is not altered with
hand.

## Usage

- Please run:
  `nx workspace-schematic dt-component-example {name of your example} {name of your component}`
