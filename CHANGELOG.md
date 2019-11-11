## 4.14.1 (2019-11-05)

### Bug Fixes

- **empty-state, table:** Fixes an issue where the empty state was not layouted
  correctly inside a table on resizing.

- **filter-field:** Fixes an issue where the currently added filter was removed
  if the data via the data-source changes when the `filterChanges` event has
  fired.

## 4.14.0 (2019-11-04)

### Bug Fixes

- **chart:** Fixes an issue where the selection area should reposition on
  viewport resize.

- **chart:** Fixes an issue where the tooltip was not shown on an area chart.

- **filter-field:** Fixes an issue where the `filterChanges` event was not
  emitted when clear-all was clicked.

### Features

- **container-breakpoint-observer:** Added container-breakpoint-observer.

## 4.13.0 (2019-10-30)

### Bug Fixes

- **filter-field:** Fixes broken state if the data source gets updated while in
  edit mode.
- **filter-field:** Removes a hardcoded length check for free text filter.

- **filter-field:** Sets a more sensible default for the filter field dropdown
  max-width.
- **formatter:** Fixed issue with negative inputs.

- **select:** Fixes an issue that the dropdown size was too small.

- **select:** Fixes an issue that the option was sometimes cut off although the
  dropdown could still grow.

### Features

- **filter-field:** Adds the feature to make a tag non deletable and non
  editable.
- **sidenav:** Added the sidenav component.

- **table:** Added a comparator input to SimpleColumns to allow sorting with a
  custom comparator.

- **tabs:** Made dt-tab-body and dtTabBodyPortalOutlet public available.

_Special Thanks_ @david.laubreiter

## 4.12.2 (2019-10-17)

### Bug Fixes

- **chart:** Fixes an error where the TouchEvent was not defined on Safari
  browser

## 4.12.1 (2019-10-16)

### Bug Fixes

- **button:** Fixes a contrast issue with nested buttons in odd table-rows by
  using a darker shade of gray for the hover on nested buttons in general.
- **chart:** Fixes an issue where the chart emitted a timeframe change event
  without interaction

- **chart:** Fixes an issue where the timeframe-change event is emitted twice
  when a timeframe is selected.

- **chart:** Fixes an issue where the timestamp was shifted by the legend offset
  when it was set programatical

- **filter-field:** Fixes an issue where distinct did not work properly when
  loading data asynchronously.

- **formatters:** Fixes an issue where very small numbers where rounded to 0

## 4.12.0 (2019-10-14)

### Bug Fixes

- **chart:** Fixes an issue where the chart selection area overlay needed a
  custom viewport size to disappear and reposition.

- **chart:** Fixes an issue where the wrong cursor was displayed if a chart
  selection was possible.

- **chart:** Optimizes the performance of the selection area overlay.

- **filter-field:** Fixes an issue where the "from" value can be smaller than
  the "to" value in the range.

- **formatters:** Fixes an issue where an error was thrown due to improper
  arguments that where passed to the date range formatter.

- **select:** Fixes an issue where the select dropdown was not growing in width
  with the select element.

### Features

- **table:** Added dtExpandableRowContent directive that enables lazy loading of
  expandable row content.
- **tag-add:** Added tag-add and tag-list component.

## 4.11.0 (2019-10-07)

### Bug Fixes

- **confirmation-dialog:** Fixes an issue where the dark theme was not applied.

- **filter-field:** Fixes and issue where the filter-tags where pushed all the
  way to the right when editing another filter.

- **highlight:** Fixes an issue when certain html entities are escaped in the
  highlights rendered text.
- **table:** Fixes an issue where the sort header did not apply sorted-styling
  when not providing a sortDirection.

### Features

- **filter-field:** Added clear-all button to allow removing all active filters.

- **stepper:** Added stepper component.

### Special Thanks

Todd Baert

## Backport: 4.10.1 (2019-10-17)

### Bug Fixes

- **chart:** Fixes an error where the TouchEvent was not defined on Safari
  browser
- **confirmation-dialog:** Fixes an issue where the dark theme was not applied.

- **filter-field:** Fixes and issue where the filter-tags where pushed all the
  way to the right when editing another filter

- **highlight:** Fixes an issue when certain html entities are escaped in the
  highlights rendered text.
- **table:** Fixes an issue where the sort header did not apply sorted-styling
  when not providing a sortDirection

## 4.10.0 (2019-10-02)

### Bug Fixes

- **button:** Fixes the distance between two buttons.
- **empty-state:** Fixes an issue where the icons had a wrong position in
  Firefox and Edge.

- **filter-field:** Fixes an issue where the currentFilter event was not emitted
  when the editing of a range has been completed.

- **form-field:** Fixes an issue where the label padding was not aligned with
  our 4px grid.

### Features

- **event-chart:** Added missing features for version 1, including custom colors
  for events, event merging, custom providable overlay, better legend detection
  and testing
- **filter-field:** Added support for floating point numbers in filter field
  range input.
- **table:** Added styling for text-buttons within a certain component context.

## 4.9.0 (2019-09-30)

### Bug Fixes

- **filter-field:** Fixes an issue where the spinner was placed in an odd
  positions in certain scenarios. The spinner is now replacing the filter icon
  in loading states.
- **highlight:** Fixes performance issues when updating terms on a lot of
  highlight component at once.

### Features

- Add aria-labelledby input to components that only had an aria-label

- **chart:** Adds touch support for the chart selection area and added the
  keyboard support to move the whole selection.

## 4.8.4 (2019-09-24)

### Bug Fixes

- **filter-field:** Fixes an issue where the spinner was placed in an odd
  positions in certain scenarios. The spinner is now replacing the filter icon
  in loading states.

## 4.8.3 (2019-09-23)

### Bug Fixes

- **empty-state:** Fixes an issue where expressionChangedAfterChecked error was
  thrown when the viewportResizer provided sync value.
- **filter-field:** Fixes an issue where distinct hasn't been set properly due
  to a falsely applied parent-autocomplete for options.

## 4.8.2 (2019-09-23)

### Bug Fixes

- **chart:** Fixes an issue where the bounding client rect could not be
  retrieved on IE Edge.

## 4.8.1 (2019-09-13)

### Bug Fixes

- **top-bar-navigation:** Fixes a problem where styling was not applied due to a
  wrong css selector

## 4.8.0 (2019-09-13)

### Bug Fixes

- **chart:** Fixes an issue where the selection area was affected by the width
  of the charts y-axis label when applied programmatically.

- **filter-field:** Fixes issue where filters can not be set programmatically
  when some data is loaded asynchronously.

### Features

- **chart:** Added seriesVisibilityChange output that emits whenever a
  legend-item is clicked and a series visibility changes.

- **consumption:** Deprecated redundant input 'min' in consumption component.

- **filter-field:** Added support for unique free-text filters.

- **top-bar-navigation:** Added the Top Bar Navigation component.

## Backport: 4.7.3 (2019-09-25)

### Bug Fixes

- **chart:** Fixes an issue where the bounding client rect could not be
  retrieved on IE Edge.

## 4.7.2 (2019-09-11)

### Bug Fixes

- **empty-state:** Fixes an issue where an expression has changed after checked

## 4.7.1 (2019-09-09)

### Bug Fixes

- **chart:** Fixes an issue that the build optimizer removed the highcharts
  global settings during builds with the prod flag
- **event-chart:** Fixes issue where svg element for pattern definitions had a
  size and did overlay other elements.

## 4.7.0 (2019-09-03)

### Bug Fixes

- **chart:** Fixes an issue that the chart selection area overlay pushed itself
  on the screen.
- **chart:** Fixes an issue that the range was able to grow outside the
  boundaries when the drag started on a series.
- **chart:** Fixes an issue where the change detection of the overlay did not
  work when the component was onPush
- **chart:** Provides new default options for legendItemClick event handler for
  non pie charts that prevent all legend items to be disabled.
- **consumption:** Fixes an issue where ARIA heading role was hard-coded.
- **empty-state:** Fixes an issue where empty state did not scale in a
  responsive way.

- **filter-field:** Fixes an issue where the edit mode did not reset when a
  filter is removed.

- **overlay:** Fixes an issue where positioning in svg elements was off.

### Features

- **chart:** Added a closed output to the range and timestamp component.

- **event-chart:** Added event chart as an experimental component. Note that the
  event-chart is not part of the root package - please import from
  @dynatrace/angular-components/event-chart

- **expandable-text:** Added expandable-text component.

- **filter-field:** Added free text validation to the filter field with Angular
  forms validators.

- **table-search:** Added table-search component.

## 4.6.1 (2019-08-26)

### Bug Fixes

- **core:** Changes css selector for optgroup to avoid potential oom exception

## 4.6.0 (2019-08-23)

### Bug Fixes

- **chart:** Fixes an issue where the references are lost on the selection area
  when the chart series or options are updated.

- **chart:** Fixes chart time config defaults to useUTC=true and use the users
  timezone
- **inline-editor:** Fixes an issue that the inline editor did not work with
  validators correctly
- **table:** Fixes an issue that the info-group icon was not colored correctly
  when only using expandable-rows

### Features

- **breadcrumbs:** Added dtBreadcrumbsItem directive and deprecated
  dt-breadcrumbs-item component

- **Logger:** Add stack param to LogEntry

- **secondary-nav:** Added the dt-secondary-nav component

### Special Thanks

Arnaud Crowther, Kamil Knitter and Bartosz Bobin

## 4.5.0 (2019-08-19)

### Bug Fixes

- **button:** Fixes issue that disabled anchor buttons would still trigger
  pointer events
- **chart:** Fixes issue where the selection-area-action directive was not
  applied because of a broken selector.
- **filter-field:** Fixes an issue where the spacing between range operators and
  input was missing
- **font-styles:** Adds the pre tag to be covered by the monospaced font styles

### Features

- **confirmation-dialog:** Added confirmation dialog component

- **table:** Added the ability to define customSortAccessor function for the
  DtTableDataSource

- **table:** Exposes the dtColumnProportion on SimpleColumns

## 4.4.1 (2019-08-08)

### Bug Fixes

- **tslint:** Remove prettier dependency from shipped tslint config

## 4.4.0 (2019-08-07)

### Bug Fixes

- **chart:** Adds fallback for missing IntersectionObserver
- **chart:** Fixes an edge case where the selection area was outside the chart
  with a specific data set

- **chart:** Fixes an issue where highcharts would not update all options when
  using the update method on the chart object

- **micro-chart:** Fixes an issue where the series was not properly cloned
  before mutation and therefore microcharts with the same series would influence
  each other
- **tree-table:** Fixes spacing for info-groups in the tree-table

### Features

- **empty-state:** Added empty state component

- **filter-field:** Adds data types for the DtFilterFieldDefaultDataSource

- **menu:** Added menu component

- **table, cta-card:** Deprecated dt-table-empty-state and cta-card

## 4.3.0 (2019-07-31)

### Bug Fixes

- **chart:** Fixes an issue where the chart tooltip is positioned off on mouse
  move.
- **chart:** Fixes an issue where the tooltip was not opened again after the
  user scrolled.

- **chart:** Fixes an issue that the tooltip was misplaced when the chart was
  not fully visible.

- **filter-field:** Fixes an issue where the selected range values have been
  removed when clicking an input field in the range overlay in the edit mode.

- **filter-field:** Fixes issue where larger numbers are cut of in the range
  input fields.
- **legend:** Fixes issue where legend items did not wrap on smaller screens.

- **overlay:** Fixes issue where overlay position was not correct when hovering
  child elements of the overlay trigger.
- **select:** Fixes an issue where options where cut off even with very short
  values.

### Features

- **chart:** Add Keyboard support for the chart selection area to add proper
  accessibility.

- **timeline-chart:** Added possibility to add overlays to markers.

- **schematics:** Create new schematic for generating linting rules.

## 4.2.1 (2019-07-26)

### Bug Fixes

- **deps:** Added d3-scale to library peer depencencies

## 4.2.0 (2019-07-25)

### Bug Fixes

- **filter-field:** Fixes an issue where the range filter failed to set
  programmatically

- **filter-field:** Fixes an issue with the filter field not correctly resetting
  when cancelling edit mode

- **filter-field:** Fixes weird spacing for range labels

- **overlay:** Fixes an issue when hovering over child elements of the trigger
  the overlay is destroyed and recreated.

- **overlay:** Fixes an issue where the instance of the component created in the
  overlay was not applied to the respective property on the overlay ref.

- **table:** Fixes an issue where the dtColumnMinWidth input did not handle
  strings correctly

### Features

- **progress-bar:** Added dark theme styles

- **timeline-chart:** Added possibility to set key timing marker

- **timeline-chart:** Added possibility to show an overlay for timing marker.

- **timeline-chart:** Added timeline chart

## 4.1.1 (2019-07-22)

### Bug Fixes

- **chart:** Fixes an issue where the value in the overlay was wrong, due to a
  missing offset in the calculation of the position on the x axis.

- **chart:** Fixes an issue where the overlay of the range/timestamp changed
  it's size when scrolled.

- **icon:** Fixes an issue where the setting of the default color broke the API
  contract
- **microchart:** Fixes an issue where null values were not shown as
  interpolated values in dt-micro-chart

- **table:** Fixes issue where the sort icon had a wrong color in unsorted
  columns

## 4.1.0 (2019-07-17)

### Bug Fixes

- **checkbox:** Fixes issue where the hover style was not applied because of a
  wrong CSS selector
- **context-dialog:** Fixes that the context dialog did not clear the overlay
  correctly when closed by pressing ESC
- **filter-field:** Fixes an issue where the filter field input value was not
  reset correctly when an option was selected and the following options where
  filtered incorrectly

- **filter-field:** Fixes an issue where the original value was not restored
  when cancelling a filter editing action

- **icon:** Fixes an issue where the default icon color was not applied
  correctly
- **switch, radio, checkbox:** Fixes issue where styling of switch, radio and
  checkbox was not aligned

### Features

- The focus style of various components is now visible only programmatic or
  keyboard interaction
- **context-dialog:** Adds an input to set custom css classes on the overlay
  panel to scope styles better
- **tabs:** Exposes currently registered tabs for testing purposes

## 4.0.1 (2019-07-10)

### Bug Fixes

- **filter-field:** Fixes an issue where autocomplete was not editable after
  async update

## 4.0.0 (2019-07-09)

### Breaking changes

- Updated dt-iconpack peer-dependency to v2.0.22

- **filter-field:** `DtFilterField` and `DtFilterFieldDefaultDataSource` classes
  are now generics

### Bug Fixes

- **table:** Fixes an issue where the table sort styling is lost when adding
  columns dynamically

### Features

- **filter-field:** Added possibility to load async data

- **table:** Updated table header appearance to fit new Barista design
  guidelines

## 3.2.0 (2019-07-08)

### Bug Fixes

- **chart:** Fixes an issue where the tooltip did not refresh when the hovered
  series changed
- **expandable-section:** Fixes an issue that aligns `expandable-section` styles
  with UX guidelines

- **filter-field:** Fixes an issue where the `filter-field-range` did not let go
  of the focus once opened

- **filter-field:** Fixes an issue where the max-width of the `filter-field-tag`
  was not aligned with Barista guideline
- **highlight:** Fixes an issue where the output text casing was wrongfully
  transformed when highlighting

- **show-more:** Fixed default hover styles and added missing dark theme styles

- **show-more:** Fixes an issue where show more was still clickable when
  disabled

### Features

- **chart:** Added `dt-chart-selection-area`

- **chart:** Deprecated the `dt-selection-area` component

- **chart:** Add Barista example and API documentation for the range component

- **chart:** Add focus method for programmatically focusing the range and
  timestamp
- **chart:** Add focus trapping for creation of timestamp and range

- **chart:** Create a chart hairline that follows mouse position on a selection
  area to indicate the current position

- **chart:** Create a selection area overlay that indicates the selected area
  (range) or time (timestamp)

- **expandable-panel:** Added `expanded` and `disabled` inputs and
  `expandChange`, `expanded` and `collapsed` outputs

- **expandable-panel:** Deprecated inputs (`opened`, `disabled`) as these values
  should be handled by the panel itself

- **expandable-section:** Added `expanded` input and `expandChange`, `expanded`
  and `collapsed` outputs, according to the updates of the expandable panel
  component
- **linting:** Added `dt-expandable-trigger-is-button` rule

## 3.1.0 (2019-07-02)

### Bug Fixes

- **card:** Fixes broken subtitle attribute selector
- **chart:** Fixes an edge case with timezones in highcharts
- **context-dialog:** Changes the first interactive element to be focused
  instead of the closing button
- **filter-field:** Fixes an issues where the `filter-field-tag` did not apply
  the overflow styling

- **radio:** Fixes issue where the `radio-button` label text was not wrapping

- **select:** Fixes broken appearance when used inside a `dt-form-field`

- **overlay:** Fixes an issue where the `overlay` is not dismissed when the
  `overlay-trigger` destroyed.

- **tag:** Introduced maximum width for `tags` to prevent overly long labels
  from breaking the layout

- **tag:** Made the remove button focusable instead of the `dt-tag` itself

### Features

- **button-group:** Added the functionality to programatically set focus to the
  `button-group` and `button-group-item`.
- **consumption:** Added consumption component

- **filter-field:** Added the filter-range capability to the `filter field`

- **formatters:** Add `date-range` pipe to transform two timestamps to a unified
  range string
- **tag:** Deprecated `disabled` input for `dt-tag` since there is no proper use
  case for it

## 3.0.1 (2019-06-19)

### Bug Fixes

- Fixes wrong peer dependency version numbers for `@angular/core`,
  `@angular/common` and `@angular/cdk`

## 3.0.0 (2019-06-19)

### Breaking changes

- Upgrade to Angular 8

- **form-field:** Removes fixed width and specifies `dt-form-field` as a block
  element.
- **key-value-list:** Property columns does now return the correct value, not
  the calculated one.

- **overlay:** Fixes missing overlayContainer parameter for position strategy in
  Cdk version 8.

- **pagination:** Removed unused interface `PaginationNumberType`.

- **table:** Fixes missing params for new `CdkTable` in Cdk version 8.

- **chart:** Removed deprecated overlay property in `chart-tooltip`.

- **copy-to-clipboard:** Removed deprecated `disabled` property.

- **info-group-cell:** Removed deprecated component `info-group-cell`.

- **pagination:** Removed deprecated `maxPages` input. Use the `length` and
  `pageSize` inputs instead.

- **table:** Removed deprecated `contentViewContainer` property.

- **table:** Removed deprecated `isLoading` property. Use `loading` instead.

- **table:** Removed deprecated `multiple` input. Use the `multiExpand` of the
  dt-table instead.

- **table:** Removed deprecated `openedChange` output from the `expandable-row`.
  Use `expanded`, `collapsed` or `expandChange` instead.

- **table:** Removed deprecated `toggle` method on the `expandable-row`.

- **table:** Removed deprecated `compareString` function. Use the
  `compareStrings` function from `@dynatrace/angular-components/core`.

- **table:** Removed deprecated `expandedRow` property. Use `openedChange`
  output of `dt-expandable-row` instead.

- **table:** Removed deprecated type `DtSortDirection`. Import it directly from
  `@dynatrace/angular-components/core`.

- **table-sort:** Adds sort icon to all sortable columns.

- **linting:** Enable a first set of custom lint rules.

### Bug Fixes

- **filterfield:** Fixes an issue where the suggestions were not shown
  immediately for freetext.

### Features

- **context dialog:** Adapted the background color of the content panel.

- **linting:** Added `dt-breadcrumbs-alt-text` rule and initialized as warnings.

- **linting:** Added `dt-inline-editor-alt-text` rule and initialized as
  warnings.

## 2.10.0 (2019-06-04)

### Bug Fixes

- **heatfield:** Fixes an issue when the Heatfield end was undefined

- **select:** Fixes issue where horizontal scrollbars are visible when options
  with long labels are in place

- **table:** Fixes an issue where data-source will break when removing the
  pagination at runtime.

- **theming:** Adds missing color yellow-400

### Features

- **styles**: Font mixins are prefixed with `dt-`. Mixins without the prefix are
  now deprecated.

### Deprecations

- **styles**: `custom-font-styles`, `custom-font-size`, `default-font`,
  `monospace-font`, `main-font`, `fluid-font-size`, `h1-font`, `h2-font`,
  `h3-font`, `code-font`, `label-font`

### Special Thanks

Dorota Zaranska

## 2.9.0 (2019-05-24)

### Features

- **filter-field:** Added possibility to apply filters programmatically

## 2.8.0 (2019-05-23)

### Bug Fixes

- **chart:** Fixes an issue where chart-gridlines overlapped chart data after
  updating
- **copy-to-clipboard:** Fixes the text color of the input within dark theme
  context
- **key-value-list:** Fixes an issue where the key-value-list did not create
  columns correctly if the container was too small
- **showmore:** Fixes an issue where the disabled property was not correctly
  handled when set programmatically

### Features

- **context-dialog:** Added the capability to add a header section to the
  context-dialog component

- **core:** Publicly provide compare functions for string and number values

- **table:** Add default datasource with pagination

- **table:** Add show more example for the table

- **table:** Added text overflow handling for simple columns

- **toast:** Pauses the toast dismiss timer when hovered with the mouse

## 2.7.0 (2019-05-13)

### Bug Fixes

- **colors:** Add missing white color definition to scss variables
- **progress-circle:** Fixes an issue where the progress-circle sizing was wrong
  and therefore it could not be easily filled with a background-color

### Features

- **breadcrumbs:** Adds appropriate aria attributes

- **inline-editor:** Adds input for aria attributes for save and cancel buttons

- **linting:** Add alt text rule for context dialog and adapt examples

- **linting:** Add dt-radio-button-name-required rule

- **linting:** Add dt-select-requires-label rule

- **linting:** Add dt-tab-group-requires-tabs rule

- **linting:** Add dt-tab-requires-label and dt-tab-requires-content rules

- **linting:** Add dt-tile-icon-needs-icon rule

## 2.6.1 (2019-04-29)

### Bug Fixes

- **context-dialog:** Fixes an issue where multiple overlays could be created

- **context-dialog:** Fixes an issue where the context dialog's overlay was not
  destroyed correctly when the context dialog was destroyed

- **context-dialog:** Fixes an issue where the context dialog overlay was not
  closed when a custom trigger was destroyed

- **table:** Fixes an issue that unstyled sorted cells when a sortable header
  unregistered
- **table:** Fixes an issue where a dtSortEvent was emitted when the table was
  destroyed

## 2.6.0 (2019-04-23)

### Bug Fixes

- **chart:** Fixes issue where tooltip was not updated if parent was set to
  onPush
- **table:** Fixes an issue where cells were not reacting to sortable columns
  being removed

### Features

- **key-value-list:** Added input to enable specifying number of columns

- **pagination:** Added possibility to setup pagination based on item count and
  page size
- **pagination:** Improved a11y
- **table:** Added a DtTableDatasource and DtSimpleColumn types for easier table
  usage

### Special Thanks

Dorota Zaranska

## 2.5.0 (2019-04-15)

### Bug Fixes

- **chart:** Fixes an issue with tooltip flickering

- **chart:** Fixes an issue that the tooltip was not positioned correctly for
  category axis, correctly positions tooltip now vertically centered for all
  chart types except pie charts

- **chart:** Fixes chart changing colors on second render sometimes

- **context-dialog:** The close button's ARIA label can now be set as input

- **overlay:** Fixes an issue where the overlay was not closed when backdrop was
  clicked in pinned mode

- **overlay:** Fixes an issue where the CD was not triggered correctly when
  mousevents were handled on the trigger

### Features

- **filter-field:** Filter tags can now be accessed and disabled.
- **linting:** Add a dt-checkbox-alt-text rule

- **linting:** Add copy-to-clipboard and toggle-button-item rules

- **linting:** Add dt-card-needs-content rule

- **linting:** Add dt-card-needs-title rule

- **linting:** Add dt-info-group-needs-title-and-icon rule

- **linting:** Add dt-loading-distractor-no-empty rule

- **linting:** Add dt-radio-button-alt-text rule

- **linting:** Add dt-show-more-no-empty rule and refactor text alternative
  check
- **linting:** Add dt-tab-content-no-empty rule

- **linting:** Add dt-tab-label-no-empty rule

- **linting:** Add no-empty rules for switch, tag and tile components

- **linting:** Add rules to ensure that a dt-tile contains all required content
  elements
- **linting:** Add rules to find direct children of dt-card and dt-tile

- **linting:** Add text alternative rule for selection area

## 2.4.0 (2019-04-05)

### Bug Fixes

- **chart:** Fixes missing highcharts logs on server for dt-chart

- **filter-field, input-field:** Fixes missing background color

- **linting:** Fixes issue where more than one dt-icon elements are not allowed
  in a dt-icon-button

- **linting:** Fixes issue where dt-button linting rule does only allow text but
  no child components

- **toggle-button:** Fixes wrong border width

### Features

- **highlight:** Added dt-highlight component for marking terms in text

## 2.3.0 (2019-04-01)

### Bug Fixes

- **filter-field:** Fixes an issue where autocomplete panel is not closed when
  pressing the escape key
- **overlay:** Fixes an issue where the DtOverlay could no longer handle SVG
  elements as origins due to a `@angular/cdk` update and instance checks. Note
  this forces us to increase the peerDependency to at least 7.3.0 of the
  `@angular/cdk` package.
- **overlay:** Fixes an issue where the overlay would refocus an element. This
  caused a scrolling issue with elements that were focused outside the viewport

- **table:** Moved multi expand property from row to table and deprecated
  `multi` property on expandable row

### Features

- **table:** Expand state of a row can be set programmatically

## 2.2.0 (2019-03-18)

### Bug Fixes

- **filter-field:** Fixes an issue where the suggestion list could not be
  filtered and stayed visible even without suggestions

- **filter-field:** Fixes an issue where the autocomplete could overlap other
  parts of the page although the filter field input was not visible. Page level
  scrolling is now blocked when the filter field's autocomplete is open

### Features

- **linting:** Adds setup to ship angular-components specific a11y and usage
  linting rules

### Special Thanks

Bernd Farka

## 2.1.0 (2019-03-12)

### Bug Fixes

- **autocomplete:** Fixes optionSelections not being emitted when the list of
  options changes
- **bundle:** Bumped peer dependency version for dt-iconpack
- **card:** Fixes card title and card-subtitle sizing
- **filter-field:** Added missing filters property in filter changes event
- **filter-field:** Fixes an issue where the filter field was not reset
  correctly when a filter was removed

- **filter-field:** Fixes an issue where the filters could not be removed if all
  options were already selected

- **filter-field:** Fixes an issue where the input reset would trigger to early
  and stop further progress
- **filter-field:** Fixes issues with streams inside the filter field

- **icon:** Downgrades icon error to warning

- **table:** Expandable trigger focus no longer gets cut off

- **toggle-button-group:** Fixed hover and active color on
  toggle-button-group-items

### Features

- **filter-field:** Added possibility to filter autocomplete options by their
  view value

## 2.0.0 (2019-03-05)

### Breaking Changes

- **alert:** Uniontype `DtAlertSeverity` is no longer available for input
  severity. Use `'error'` or `'warning'` instead.
- **alert:** Input severity no longer takes `undefined` as a value for hiding
  the alert. Use `'error'` or `'warning'` for severity values and `*ngIf` to
  show or hide it.

```html
<dt-alert *ngIf="isVisible" severity="warning">...</dt-alert>
```

- **card:**: The `<dt-card-actions>` component is no longer available. Use
  `<dt-card-title-actions>` instead.
- **chart:** The constant `CHART_COLOR_PALETTE_ORDERED` has been renamed to
  `DT_CHART_COLOR_PALETTE_ORDERED`.
- **chart:** The constant `CHART_COLOR_PALETTES` has been renamed to
  `DT_CHART_COLOR_PALETTES`.
- **core:** The enum `Colors` has been renamed to `DtColors`
- **key-value-list:** The key and value inputs on the item have been removed.
  Use the `dt-key-value-list-key` and `dt-key-value-list-value` elements
  instead.

```html
<dt-key-value-list>
  <dt-key-value-list-item *ngFor="let entry of entries">
    <dt-key-value-list-key>{{ entry.key }}</dt-key-value-list-key>
    <dt-key-value-list-value>{{ entry.value }}</dt-key-value-list-value>
  </dt-key-value-list-item>
  <dt-key-value-list></dt-key-value-list>
</dt-key-value-list>
```

- **logger:** The value `WARN` for the enum DtLogLevel has been renamed to
  `WARNING`.
- **micro-chart:** Uniontype `DtMicroChartSeries` is no longer available for the
  series input. Use `Observable<DtChartSeries[]>`, `Observable<DtChartSeries>`,
  `DtChartSeries[]` or `DtChartSeries` instead.
- **table:** `<dt-expandable-cell>` is now required if you use a
  `<dt-expandable-row>`.

### Features

- **filter-field:** Added DataSource as main API entry point

- **filter-field:** Added support for distinct values in default data source

- **table:** Expandable row trigger moved to dt-expandable-cell instead of whole
  row

## 1.8.3 (2019-03-04)

### Bug Fixes

- **autocomplete:** fixes custom panel classes are not set
- **chart, selection-area:** fixes an issue where the highcharts instance would
  be updated after it has been destroyed

- **selection-area:** fixes an issue where the position of the selection area on
  the chart was not correct

- **selection-area:** fixes an issue where the selection-area-container was
  moved to the content of the parent component, if the parent used ng-content

- **selection-area:** fixes the issue that the overlay of the selection area
  pushed itself on the screen

## 1.8.2 (2019-02-25)

### Bug Fixes

- **info-group:** adds support for being used inside a dt-table

- **micro-chart:** fixes `markers` default option for micro-charts

- **table:** fixes styling for sorting when rows are added dynamically

- **tile:** fixes border styling to fully fit design specifications

### Deprecations

**info-group-cell**: Use info-group instead

## 1.8.1 (2019-02-18)

### Bug Fixes

- **chart:** adds default options for no utc time and marker disabling

- **copy-to-clipboard:** fixes background color for copy to clipboard input
  field on dark background

- **loading-distractor:** fixes font-weight of loading distractor label

- **selection-area:** fixes cursor not being correct

- **selection-area:** fixes issue that events where captured on plotbackground
  rather than an eventlayer on top

- **selection-area:** fixes issue that overlay was not pushing itself on the
  screen horizontally

- **selection-area:** fixes issue that selection area was created on mousedown
  rather than on mousemove

- **table, chart:** fixes chart not shrinking in expandable table row

- **select:** fixes overlay positioning when opening to the right and sticking
  outside of the screen

## 1.8.0 (2019-02-12)

### Bug Fixes

- **chart:** fixes rendering issue in highcharts

- **context-dialog:** fixes issue where context dialog only opens to the left

- **select:** fixes size of select in IE11

- **table-with-sorting:** fixes IE11 not displaying sort header correctly

### Features

- **info-group:** adds new info group component

- **micro-chart:** add option to interpolate data gaps and show it with a
  different visual style

### Special Thanks

Dominik Messner, Rene Panzar

## 1.7.1 (2019-02-05)

### Bug Fixes

- **table, tree-table:** fixes issue where table or tree-table is not fully
  rendered in AOT mode

## 1.7.0 (2019-02-04)

### Bug Fixes

- **schematics:** fixes dt-component schematic to fit new lib structure

### Features

- **table, info-group-cell:** adds info-group-cell component that provides
  proper styling for two lines and an icon inside a table cell

- **toggle-button-group:** add toggle-button-group

- **tree-table:** add tree table component

## 1.6.2 (2019-01-31)

### Bug Fixes

- **link:** removes extend-dependency in styles for better compatibility with
  newer sass versions

## 1.6.1 (2019-01-25)

### Bug Fixes

- **breadcrumbs:** fixes issue where arrow is not styled correctly
- **filter-field:** fixes change event not beeing emitted when removing node

## 1.6.0 (2019-01-24)

### Bug Fixes

- **button:** fixes icon button not working with anchor tags

- **card, cta-card:** fixes spacing issue between content and footer actions

- **radio:** fixes underlying label not expanding to width of radio button

### Features

- **breadcrumbs:** added color input to breadcrumbs, they now accept `main`,
  `error` or `neutral`.

- **theming:** added neutral variation to themes

## 1.5.1 (2019-01-21)

### Bug Fixes

- **bar-indicator:** fixes broken internal styling

## 1.5.0 (2019-01-18)

### Bug Fixes

- **switch:** fixes colors on dark background

- **table:** fixes font weight for table's empty state

- **typography:** updated styles for h1-h3 headlines

### Features

- **bar-indicator:** added bar-indicator component

- **drawer:** added basic drawer component

### Special Thanks

Katrin Freihofner, Thomas Heller, Lara Aigmueller, Lukas Holzer

## 1.4.0 (2019-01-16)

### Bug Fixes

- **btn-group:** fixes broken responsive behavior on small screen

- **card, cta-card:** fixes spacing between action buttons

- **checkbox:** fixes issue when disabled attribute is set without a value

- **table:** fixes sorted cells not beeing bold like in the header cell

- **toast:** fixes subsequent toasts not being shown immidiately after the
  previous toast disappears

### Features

- **colors:** added missing colors definition to DtColors

- **inline-editor:** added keyboard support for save and cancel

### Special Thanks

Ramon Arenal, Bartosz Bobin, Lukas Holzer, Katrin Freihofner

## 1.3.0 (2019-01-09)

### Bug Fixes

- **button:** added active style for nested buttons in the dark theme

- **switch:** fixes switch styles to fit the styleguide

- **colors:** add missing colors definition (red, green, shamrockgreen) to
  DtColors

### Features

- **card:** added card footer actions

- **charts:** added function for selecting color palette based on nrOfMetrics
  and Theme

### Deprecations

- **card:** `dt-card-actions` has been replaced with `dt-card-title-actions`

### Special Thanks

Katrin Freihofner, Thomas Heller, Bartosz Bobin

## 1.2.1 (2019-01-02)

### Bug Fixes

- **microchart:** fixes dt-tooltip with microchart

- **chart, microchart:** fixes dt-tooltip not working when used in an app built
  with the prod flag

## 1.2.0 (2018-12-20)

### Bug Fixes

- **chart:** make tooltip positioning more resilient to highcharts

- **micro-chart:** improved highcharts default options

- **micro-chart:** improved colors and fixed theming

### Features

- **micro-chart:** added possibility to format labels

### Special Thanks

Alexander Lagler, Manfred Del Fabro

## 1.1.0 (2018-12-20)

### Bug Fixes

- **chart:** fixes issue where tooltip did not work with single metric data from
  highcharts
- **selection-area:** fixes positioning of the selection area element if a
  parent has position relative

### Features

- **key-value-list:** Added possibility to use html for key and value

- **progressbar:** Added description and count capabilities

- **table:** Added interactiveRows property to table which makes the rows
  interactive(hover)

### Special Thanks

Bartosz Bobin, Thomas Heller, Luca Liguori

## 1.0.0 (2018-12-18)

### Bug Fixes

- **alert:** Replaced inline svg with dtIcons

- **autocomplete:** fixes dynamically changing autocompletes

- **breadcrumb:** remove router dependency

- **button:** fixes removes theming capabilities for main active theme color on
  button
- **button:** fixes button active issue in IE11+

- **button:** fixes icon container change detection issue

- **button:** fixes icon size in buttons

- **button:** fixes missing styles on anchor

- **button:** fixes nested button background issue

- **button:** fixes existing icon container when icon has been removed

- **button:** fixes superscript issue

- **card:** fixes wrong spacing on icon
- **card:** removes outer spacing (margin)

- **chart:** added correct font
- **chart:** added default global options

- **chart:** Added loading text to make it i18n compatible

- **chart:** fixes issue that options where mutated instead of cloned
- **chart:** corrected easing functions overshoot

- **chart:** fixed chart area icon
- **chart:** fixed chart blue theme

- **chart:** fixed legend overrides
- **chart:** fixed legend sizing, coloring, disabled
- **chart:** fixed no options/series passed
- **chart:** fixed reflow issue
- **chart:** fixes for pie chart coloring

- **chart:** fixes missing legendicons when building an app with the prod flag

- **chart:** fixes tooltip not being wrapped when changing options at runtime

- **chart:** remove all change-detection cycles that were triggered by
  highcharts events
- **chart:** fixes subscription cleanup on destroy

- **chart:** update chart selection model

- **chart:** use lodash merge function to deeply mergeClone options

- **checkbox:** disable animation timing in IE

- **checkbox:** fixes container size issue in non border-box environments

- **context-dialog:** added spacing for closing btn, improved focus management
- **context-dialog:** fixes issue where context-dialog does not close on blur

- **core:** rename log level name for consistency

- **expandable-section, expandable-panel:** Changed inline svg to dtIcon

- **expandable-section, expandable-panel:** fixes issue where openedChange does
  not fire when opened property is set
- **expandable-section, expandable-panel:** fixes issue where openedChange
  subscription is not unsubscribed
- **filter-field:** fixes broken nested button override

- **filter-field:** handle input keyup only on free text

- **filter-field:** node removal on backspace

- **formatters:** added chaining capabilities

- **formatters:** make pipes more resilient to strange input

- **form-field:** fixes spacing of error messages

- **form-field:** fixes issue where error element is overlapped

- **form-field:** fixes multiple styling issues with icons and buttons
- **icon:** fixes issue where icons are loaded multiple times

- **icon:** changed icon color to white on darkthemes
- **icon:** add escaping inside icon registry

- **inline-editor:** fixes edit icon
- **inline-editor:** fixes IE issue

- **inline-editor:** model now updates only when save is pressed
- **inline-editor:** fixes issue when dt-errors are not passed to form-field

- **input:** fixes red outline in firefox

- **input:** fixes disabled background color
- **input:** fixes design issues

- **input:** fixes ie issue

- **loading-distractor:** added spinner
- **loading-spinner:** fixes animation when only spinner is used
- **loading-spinner:** fixes xml namespace issue for svg in angular core
- **progress-bar:** Fixes IE11 issue

- **progress-circle:** fix path not being drawn correctly in IE

- **progress-circle:** fixed getter calling setter and emitting event

- **progress-circle:** scales icons in progress-circle

- **radio:** fixes issue when setting disabled directly

- **select:** fixes valueChange emitting undefined when value zero has been set

- **select:** removes themeable arrow icon in select

- **select:** fixes multiline issue

- **table:** fix chart in expandable table not being hidden correctly

- **table:** fixed sort icon direction

- **tag:** removed outside spacing

- **theming:** add missing blue colors

- **theming:** fixes issue where theme did not unsubscribe from parent properly
- **theming:** fixes theme inheritance

- **theming:** fixes issue when getting an error if there is no parent theme

### Features

- **alert:** added alert component
- **autocomplete:** added autocomplete

- **button:** added button component
- **button:** added loading spinner for button

- **button:** added nested variant

- **button:** added icon button

- **card:** added card component
- **chart:** added chart component
- **chart:** added heatfield & overload prevention capabilities

- **chart:** added axis defaults for font size

- **chart:** added support for area range

- **chart:** added custom legend icons
- **chart:** added loading distractor to the chart
- **chart:** handles visibility without data

- **chart:** handles empty points inside tooltip

- **chart:** added new color strategy and colors

- **chart:** added support for series and options as observables
- **chart:** added support for tooltip
- **cta-card:** added CTA card component
- **checkbox:** added checkbox component

- **checkbox:** added dark theme

- **context-dialog:** added context dialog component
- **filter-field:** added filter-field

- **form-field:** added form-field component
- **icon:** added icon component and registry

- **icon:** added dt-iconpack support

- **icon:** added dt-iconpack integration

- **indicator:** added indicator component

- **input:** added input directive
- **input, form-field:** added autofill monitor

- **loading-distractor:** added loading-distractor component
- **option:** added option component; to be used in other components such as
  select
- **overlay:** added overlay component

- **progress-circle:** added progress-circle

- **radio:** added radio

- **select:** added select component

- **selection-area:** added selection-area

- **table:** added table component
- **table:** added problem indicator capabilities

- **table:** added sorting capabilities

- **table:** added sticky header

- **tabs:** added tabs

- **theming:** added theming

- **tile:** added tile component
- **tile:** added icons to tile

- **toast:** added toast component

- **viewport-resizer:** added viewport resizer
