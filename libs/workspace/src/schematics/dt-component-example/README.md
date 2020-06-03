# Shipped schematics

This schematics generates the component for barista examples. The only needed
parameters are the name of the component and the example.

The schematics is compatible with previously added components, so if the
component already has example, a new example for that component will be
generated.

Note: the compatibility mentioned above can be only guaranteed if the original
example component was generated with this schematics, and is not altered with
hand.

## Usage

- Please run: `ng build workspace` and after that,
  `ng g ./dist/libs/workspace:dt-example --name={name of your example} --component={name of your component}`

### Testing

The schematics can be tested with the `ng test workspace` command.
