# Shipped schematics

## ng update

The angular cli provides an interface to run automatic update scripts with
`ng update` for library authers. To achieve this we are using the
`migration.json` file to specify the schematics that need to run for each
version individually. For now we are only shipping update schematics for the
bump from 4.x to 5.0. But in the future we can provide scripts from 5.x to 6.0.
If a user needs to upgrade from 4.x to 6.0 and jump version 5 the update
schematic will execute the bumps in sequence. So first the update schematic for
version 4.x to 5.0 will run and afterwards 5.x to 6.0.

### Testing

There are tests for the update schematics that create a virtual demo app that is
used to check whether the schematic changes the correct things.

If you want to test the schematic on a real world app you should perform the
following steps:

- Run `yarn build` - this builds the library including the schematics and puts
  it into the `dist/lib` folder
- Link the npm dependency of the `@dynatrace/angular-components` to the
  `dist/lib` folder
- run
  `ng update @dynatrace/angular-components --migrateOnly=true --from="4.8.0" --to="5.0.0"`
  with the correct versions respectively
