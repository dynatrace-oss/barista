# 4.15.1 (2019-12-02)

### Bug Fixes

- **context-dialog:** Fixes positioning issues by removing the closing button
  that tightly coupled the position to the trigger

# 4.15.0 (2019-11-20)

### Bug Fixes

- **chart:** Fixes an issue where the tooltip was not shown when hovering the
  same data point twice.
- **table:** Fixes an issue that if a datasource was set to empty twice in a row
  the empty state was not visible.

### Features

- **container-breakpoint-observer:** Added the if-container-breakpoint
  structural directive for showing/hiding elements based on a container query.
- **event-chart:** Added coloring changes based on UX feedback, changed patterns
  to be defined by lanes, fixed flickering overlay, added pinnable functionality
  to overlays.
- **filter-field:** Adds unique option to range options.
- **overlay:** Added a feature which allows the user to update the implicit
  context on an overlay reference.
- **table:** Allows to apply a sort programmatically by passing a column
  identifier and a direction.
