# E2E Test component schematics

This schematics generates the component for barista e2e tests. The only needed
parameter is the name of the component.

## Usage

- Please run: `ng build workspace` and after that,
  `ng g ./dist/libs/workspace:dt-e2e --name={name of your component}`

### Testing

The schematics can be tested with the `ng test workspace` command.
