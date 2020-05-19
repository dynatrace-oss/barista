# Dev component schematics

This schematics generates the component for the barista dev environment app. The
only needed parameter is the name of the component.

## Usage

- Please run: `ng build workspace` and after that,
  `ng g ./dist/libs/workspace:dt-dev --name={name of your component}`

### Testing

The schematics can be tested with the `ng test workspace
