## 4.1.0 (2019-07-17)

### Bug Fixes

- **checkbox:** Fixes issue where the hover style was not applied because of a
  wrong CSS selector
- **context-dialog:** Fixes that the context dialog did not clear the overlay
  correctly when closed by pressing ESC
- **filter-field:** Fixes an issue where the filter field input value was not
  reset correctly when an option was selected and the following options where
  filtered incorrectly
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the original value was not restored
  when cancelling a filter editing action
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **icon:** Fixes an issue where the default icon color was not applied
  correctly ([***REMOVED***](***REMOVED***/***REMOVED***))
- **switch, radio, checkbox:** Fixes issue where styling of switch, radio and
  checkbox was not aligned
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- The focus style of various components is now visible only programmatic or
  keyboard interaction
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** Adds an input to set custom css classes on the overlay
  panel to scope styles better
- **tabs:** Exposes currently registered tabs for testing purposes

## 4.0.1 (2019-07-10)

### Bug Fixes

- **filter-field:** Fixes an issue where autocomplete was not editable after
  async update ([***REMOVED***](***REMOVED***/***REMOVED***))

## 4.0.0 (2019-07-09)

### Breaking changes

- Updated dt-iconpack peer-dependency to v2.0.22
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** `DtFilterField` and `DtFilterFieldDefaultDataSource` classes
  are now generics
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Bug Fixes

- **table:** Fixes an issue where the table sort styling is lost when adding
  columns dynamically
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **filter-field:** Added possibility to load async data
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Updated table header appearance to fit new Barista design
  guidelines ([***REMOVED***](***REMOVED***/***REMOVED***))

## 3.2.0 (2019-07-08)

### Bug Fixes

- **chart:** Fixes an issue where the tooltip did not refresh when the hovered
  series changed
- **expandable-section:** Fixes an issue that aligns `expandable-section` styles
  with UX guidelines
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the `filter-field-range` did not let go
  of the focus once opened
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the max-width of the `filter-field-tag`
  was not aligned with Barista guideline
- **highlight:** Fixes an issue where the output text casing was wrongfully
  transformed when highlighting
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **show-more:** Fixed default hover styles and added missing dark theme styles
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **show-more:** Fixes an issue where show more was still clickable when
  disabled ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **chart:** Added `dt-chart-selection-area`
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Deprecated the `dt-selection-area` component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Add Barista example and API documentation for the range component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Add focus method for programmatically focusing the range and
  timestamp ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Add focus trapping for creation of timestamp and range
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Create a chart hairline that follows mouse position on a selection
  area to indicate the current position
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Create a selection area overlay that indicates the selected area
  (range) or time (timestamp)
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **expandable-panel:** Added `expanded` and `disabled` inputs and
  `expandChange`, `expanded` and `collapsed` outputs
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **expandable-panel:** Deprecated inputs (`opened`, `disabled`) as these values
  should be handled by the panel itself
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **expandable-section:** Added `expanded` input and `expandChange`, `expanded`
  and `collapsed` outputs, according to the updates of the expandable panel
  component ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Added `dt-expandable-trigger-is-button` rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 3.1.0 (2019-07-02)

### Bug Fixes

- **card:** Fixes broken subtitle attribute selector
- **chart:** Fixes an edge case with timezones in highcharts
- **context-dialog:** Changes the first interactive element to be focused
  instead of the closing button
- **filter-field:** Fixes an issues where the `filter-field-tag` did not apply
  the overflow styling
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **radio:** Fixes issue where the `radio-button` label text was not wrapping
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** Fixes broken appearance when used inside a `dt-form-field`
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** Fixes an issue where the `overlay` is not dismissed when the
  `overlay-trigger` destroyed.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tag:** Introduced maximum width for `tags` to prevent overly long labels
  from breaking the layout
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tag:** Made the remove button focusable instead of the `dt-tag` itself
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **button-group:** Added the functionality to programatically set focus to the
  `button-group` and `button-group-item`.
- **consumption:** Added consumption component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Added the filter-range capability to the `filter field`
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **formatters:** Add `date-range` pipe to transform two timestamps to a unified
  range string ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tag:** Deprecated `disabled` input for `dt-tag` since there is no proper use
  case for it ([***REMOVED***](***REMOVED***/***REMOVED***))

## 3.0.1 (2019-06-19)

### Bug Fixes

- Fixes wrong peer dependency version numbers for `@angular/core`,
  `@angular/common` and `@angular/cdk`

## 3.0.0 (2019-06-19)

### Breaking changes

- Upgrade to Angular 8
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **form-field:** Removes fixed width and specifies `dt-form-field` as a block
  element. ([***REMOVED***](***REMOVED***/***REMOVED***))
- **key-value-list:** Property columns does now return the correct value, not
  the calculated one.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** Fixes missing overlayContainer parameter for position strategy in
  Cdk version 8.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **pagination:** Removed unused interface `PaginationNumberType`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Fixes missing params for new `CdkTable` in Cdk version 8.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Removed deprecated overlay property in `chart-tooltip`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **copy-to-clipboard:** Removed deprecated `disabled` property.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **info-group-cell:** Removed deprecated component `info-group-cell`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **pagination:** Removed deprecated `maxPages` input. Use the `length` and
  `pageSize` inputs instead.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `contentViewContainer` property.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `isLoading` property. Use `loading` instead.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `multiple` input. Use the `multiExpand` of the
  dt-table instead.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `openedChange` output from the `expandable-row`.
  Use `expanded`, `collapsed` or `expandChange` instead.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `toggle` method on the `expandable-row`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `compareString` function. Use the
  `compareStrings` function from `@dynatrace/angular-components/core`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated `expandedRow` property. Use `openedChange`
  output of `dt-expandable-row` instead.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Removed deprecated type `DtSortDirection`. Import it directly from
  `@dynatrace/angular-components/core`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table-sort:** Adds sort icon to all sortable columns.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Enable a first set of custom lint rules.
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Bug Fixes

- **filterfield:** Fixes an issue where the suggestions were not shown
  immediately for freetext.
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **context dialog:** Adapted the background color of the content panel.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Added `dt-breadcrumbs-alt-text` rule and initialized as warnings.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Added `dt-inline-editor-alt-text` rule and initialized as
  warnings. ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.10.0 (2019-06-04)

### Bug Fixes

- **heatfield:** Fixes an issue when the Heatfield end was undefined
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** Fixes issue where horizontal scrollbars are visible when options
  with long labels are in place
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Fixes an issue where data-source will break when removing the
  pagination at runtime.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
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
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.8.0 (2019-05-23)

### Bug Fixes

- **chart:** Fixes an issue where chart-gridlines overlapped chart data after
  updating ([***REMOVED***](***REMOVED***/***REMOVED***))
- **copy-to-clipboard:** Fixes the text color of the input within dark theme
  context
- **key-value-list:** Fixes an issue where the key-value-list did not create
  columns correctly if the container was too small
- **showmore:** Fixes an issue where the disabled property was not correctly
  handled when set programmatically
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **context-dialog:** Added the capability to add a header section to the
  context-dialog component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **core:** Publicly provide compare functions for string and number values
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Add default datasource with pagination
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Add show more example for the table
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Added text overflow handling for simple columns
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toast:** Pauses the toast dismiss timer when hovered with the mouse
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.7.0 (2019-05-13)

### Bug Fixes

- **colors:** Add missing white color definition to scss variables
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progress-circle:** Fixes an issue where the progress-circle sizing was wrong
  and therefore it could not be easily filled with a background-color

### Features

- **breadcrumbs:** Adds appropriate aria attributes
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **inline-editor:** Adds input for aria attributes for save and cancel buttons
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add alt text rule for context dialog and adapt examples
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-radio-button-name-required rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-select-requires-label rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-tab-group-requires-tabs rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-tab-requires-label and dt-tab-requires-content rules
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-tile-icon-needs-icon rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.6.1 (2019-04-29)

### Bug Fixes

- **context-dialog:** Fixes an issue where multiple overlays could be created
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** Fixes an issue where the context dialog's overlay was not
  destroyed correctly when the context dialog was destroyed
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** Fixes an issue where the context dialog overlay was not
  closed when a custom trigger was destroyed
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Fixes an issue that unstyled sorted cells when a sortable header
  unregistered ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Fixes an issue where a dtSortEvent was emitted when the table was
  destroyed ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.6.0 (2019-04-23)

### Bug Fixes

- **chart:** Fixes issue where tooltip was not updated if parent was set to
  onPush
- **table:** Fixes an issue where cells were not reacting to sortable columns
  being removed

### Features

- **key-value-list:** Added input to enable specifying number of columns
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **pagination:** Added possibility to setup pagination based on item count and
  page size ([***REMOVED***](***REMOVED***/***REMOVED***))
- **pagination:** Improved a11y
- **table:** Added a DtTableDatasource and DtSimpleColumn types for easier table
  usage ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Dorota Zaranska

## 2.5.0 (2019-04-15)

### Bug Fixes

- **chart:** Fixes an issue with tooltip flickering
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Fixes an issue that the tooltip was not positioned correctly for
  category axis, correctly positions tooltip now vertically centered for all
  chart types except pie charts
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Fixes chart changing colors on second render sometimes
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** The close button's ARIA label can now be set as input
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** Fixes an issue where the overlay was not closed when backdrop was
  clicked in pinned mode
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** Fixes an issue where the CD was not triggered correctly when
  mousevents were handled on the trigger
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **filter-field:** Filter tags can now be accessed and disabled.
- **linting:** Add a dt-checkbox-alt-text rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add copy-to-clipboard and toggle-button-item rules
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-card-needs-content rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-card-needs-title rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-info-group-needs-title-and-icon rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-loading-distractor-no-empty rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-radio-button-alt-text rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-show-more-no-empty rule and refactor text alternative
  check ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-tab-content-no-empty rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add dt-tab-label-no-empty rule
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add no-empty rules for switch, tag and tile components
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add rules to ensure that a dt-tile contains all required content
  elements ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add rules to find direct children of dt-card and dt-tile
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Add text alternative rule for selection area
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.4.0 (2019-04-05)

### Bug Fixes

- **chart:** Fixes missing highcharts logs on server for dt-chart
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field, input-field:** Fixes missing background color
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Fixes issue where more than one dt-icon elements are not allowed
  in a dt-icon-button
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **linting:** Fixes issue where dt-button linting rule does only allow text but
  no child components
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toggle-button:** Fixes wrong border width
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **highlight:** Added dt-highlight component for marking terms in text
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.3.0 (2019-04-01)

### Bug Fixes

- **filter-field:** Fixes an issue where autocomplete panel is not closed when
  pressing the escape key
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** Fixes an issue where the DtOverlay could no longer handle SVG
  elements as origins due to a `@angular/cdk` update and instance checks. Note
  this forces us to increase the peerDependency to at least 7.3.0 of the
  `@angular/cdk` package.
- **overlay:** Fixes an issue where the overlay would refocus an element. This
  caused a scrolling issue with elements that were focused outside the viewport
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Moved multi expand property from row to table and deprecated
  `multi` property on expandable row
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **table:** Expand state of a row can be set programmatically
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 2.2.0 (2019-03-18)

### Bug Fixes

- **filter-field:** Fixes an issue where the suggestion list could not be
  filtered and stayed visible even without suggestions
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the autocomplete could overlap other
  parts of the page although the filter field input was not visible. Page level
  scrolling is now blocked when the filter field's autocomplete is open
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **linting:** Adds setup to ship angular-components specific a11y and usage
  linting rules ([***REMOVED***](***REMOVED***/***REMOVED***))

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
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the filters could not be removed if all
  options were already selected
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Fixes an issue where the input reset would trigger to early
  and stop further progress
- **filter-field:** Fixes issues with streams inside the filter field
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **icon:** Downgrades icon error to warning
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Expandable trigger focus no longer gets cut off
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toggle-button-group:** Fixed hover and active color on
  toggle-button-group-items
  ([***REMOVED***](***REMOVED***/***REMOVED***))

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
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** Added support for distinct values in default data source
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Expandable row trigger moved to dt-expandable-cell instead of whole
  row ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.8.3 (2019-03-04)

### Bug Fixes

- **autocomplete:** fixes custom panel classes are not set
- **chart, selection-area:** fixes an issue where the highcharts instance would
  be updated after it has been destroyed
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes an issue where the position of the selection area on
  the chart was not correct
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes an issue where the selection-area-container was
  moved to the content of the parent component, if the parent used ng-content
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes the issue that the overlay of the selection area
  pushed itself on the screen
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.8.2 (2019-02-25)

### Bug Fixes

- **info-group:** adds support for being used inside a dt-table
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **micro-chart:** fixes `markers` default option for micro-charts
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** fixes styling for sorting when rows are added dynamically
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tile:** fixes border styling to fully fit design specifications
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Deprecations

**info-group-cell**: Use info-group instead
([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.8.1 (2019-02-18)

### Bug Fixes

- **chart:** adds default options for no utc time and marker disabling
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **copy-to-clipboard:** fixes background color for copy to clipboard input
  field on dark background
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **loading-distractor:** fixes font-weight of loading distractor label
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes cursor not being correct
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes issue that events where captured on plotbackground
  rather than an eventlayer on top
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes issue that overlay was not pushing itself on the
  screen horizontally
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes issue that selection area was created on mousedown
  rather than on mousemove
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table, chart:** fixes chart not shrinking in expandable table row
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** fixes overlay positioning when opening to the right and sticking
  outside of the screen
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.8.0 (2019-02-12)

### Bug Fixes

- **chart:** fixes rendering issue in highcharts
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** fixes issue where context dialog only opens to the left
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** fixes size of select in IE11
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table-with-sorting:** fixes IE11 not displaying sort header correctly
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **info-group:** adds new info group component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **micro-chart:** add option to interpolate data gaps and show it with a
  different visual style
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Dominik Messner, Rene Panzar

## 1.7.1 (2019-02-05)

### Bug Fixes

- **table, tree-table:** fixes issue where table or tree-table is not fully
  rendered in AOT mode

## 1.7.0 (2019-02-04)

### Bug Fixes

- **schematics:** fixes dt-component schematic to fit new lib structure
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **table, info-group-cell:** adds info-group-cell component that provides
  proper styling for two lines and an icon inside a table cell
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toggle-button-group:** add toggle-button-group
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tree-table:** add tree table component
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.6.2 (2019-01-31)

### Bug Fixes

- **link:** removes extend-dependency in styles for better compatibility with
  newer sass versions
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.6.1 (2019-01-25)

### Bug Fixes

- **breadcrumbs:** fixes issue where arrow is not styled correctly
- **filter-field:** fixes change event not beeing emitted when removing node
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.6.0 (2019-01-24)

### Bug Fixes

- **button:** fixes icon button not working with anchor tags
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **card, cta-card:** fixes spacing issue between content and footer actions
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **radio:** fixes underlying label not expanding to width of radio button

### Features

- **breadcrumbs:** added color input to breadcrumbs, they now accept `main`,
  `error` or `neutral`.
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **theming:** added neutral variation to themes
  ([***REMOVED***](***REMOVED***/***REMOVED***)

## 1.5.1 (2019-01-21)

### Bug Fixes

- **bar-indicator:** fixes broken internal styling
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.5.0 (2019-01-18)

### Bug Fixes

- **switch:** fixes colors on dark background
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** fixes font weight for table's empty state
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **typography:** updated styles for h1-h3 headlines
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **bar-indicator:** added bar-indicator component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **drawer:** added basic drawer component
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Katrin Freihofner, Thomas Heller, Lara Aigmueller, Lukas Holzer

## 1.4.0 (2019-01-16)

### Bug Fixes

- **btn-group:** fixes broken responsive behavior on small screen
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **card, cta-card:** fixes spacing between action buttons
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **checkbox:** fixes issue when disabled attribute is set without a value
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** fixes sorted cells not beeing bold like in the header cell
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toast:** fixes subsequent toasts not being shown immidiately after the
  previous toast disappears
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **colors:** added missing colors definition to DtColors
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **inline-editor:** added keyboard support for save and cancel
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Ramon Arenal, Bartosz Bobin, Lukas Holzer, Katrin Freihofner

## 1.3.0 (2019-01-09)

### Bug Fixes

- **button:** added active style for nested buttons in the dark theme
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **switch:** fixes switch styles to fit the styleguide
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **colors:** add missing colors definition (red, green, shamrockgreen) to
  DtColors ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **card:** added card footer actions
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **charts:** added function for selecting color palette based on nrOfMetrics
  and Theme ([***REMOVED***](***REMOVED***/***REMOVED***))

### Deprecations

- **card:** `dt-card-actions` has been replaced with `dt-card-title-actions`

### Special Thanks

Katrin Freihofner, Thomas Heller, Bartosz Bobin

## 1.2.1 (2019-01-02)

### Bug Fixes

- **microchart:** fixes dt-tooltip with microchart
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart, microchart:** fixes dt-tooltip not working when used in an app built
  with the prod flag
  ([***REMOVED***](***REMOVED***/***REMOVED***))

## 1.2.0 (2018-12-20)

### Bug Fixes

- **chart:** make tooltip positioning more resilient to highcharts
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **micro-chart:** improved highcharts default options
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **micro-chart:** improved colors and fixed theming
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **micro-chart:** added possibility to format labels
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Alexander Lagler, Manfred Del Fabro

## 1.1.0 (2018-12-20)

### Bug Fixes

- **chart:** fixes issue where tooltip did not work with single metric data from
  highcharts ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** fixes positioning of the selection area element if a
  parent has position
  relative([***REMOVED***](***REMOVED***/***REMOVED***))

### Features

- **key-value-list:** Added possibility to use html for key and value
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progressbar:** Added description and count capabilities
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** Added interactiveRows property to table which makes the rows
  interactive(hover)
  ([***REMOVED***](***REMOVED***/***REMOVED***))

### Special Thanks

Bartosz Bobin, Thomas Heller, Luca Liguori

## 1.0.0 (2018-12-18)

### Bug Fixes

- **alert:** Replaced inline svg with dtIcons
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **autocomplete:** fixes dynamically changing autocompletes
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **breadcrumb:** remove router dependency
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes removes theming capabilities for main active theme color on
  button ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes button active issue in IE11+
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes icon container change detection issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes icon size in buttons
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes missing styles on anchor
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes nested button background issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes existing icon container when icon has been removed
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** fixes superscript issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **card:** fixes wrong spacing on icon
- **card:** removes outer spacing (margin)
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added correct font
- **chart:** added default global options
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** Added loading text to make it i18n compatible
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** fixes issue that options where mutated instead of cloned
- **chart:** corrected easing functions overshoot
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** fixed chart area icon
- **chart:** fixed chart blue theme
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** fixed legend overrides
- **chart:** fixed legend sizing, coloring, disabled
- **chart:** fixed no options/series passed
- **chart:** fixed reflow issue
- **chart:** fixes for pie chart coloring
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** fixes missing legendicons when building an app with the prod flag
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** fixes tooltip not being wrapped when changing options at runtime
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** remove all change-detection cycles that were triggered by
  highcharts events
- **chart:** fixes subscription cleanup on destroy
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** update chart selection model
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** use lodash merge function to deeply mergeClone options
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **checkbox:** disable animation timing in IE
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **checkbox:** fixes container size issue in non border-box environments
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** added spacing for closing btn, improved focus management
- **context-dialog:** fixes issue where context-dialog does not close on blur
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **core:** rename log level name for consistency
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **expandable-section, expandable-panel:** Changed inline svg to dtIcon
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **expandable-section, expandable-panel:** fixes issue where openedChange does
  not fire when opened property is set
- **expandable-section, expandable-panel:** fixes issue where openedChange
  subscription is not unsubscribed
- **filter-field:** fixes broken nested button override
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** handle input keyup only on free text
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **filter-field:** node removal on backspace
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **formatters:** added chaining capabilities
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **formatters:** make pipes more resilient to strange input
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **form-field:** fixes spacing of error messages
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **form-field:** fixes issue where error element is overlapped
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **form-field:** fixes multiple styling issues with icons and buttons
- **icon:** fixes issue where icons are loaded multiple times
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **icon:** changed icon color to white on darkthemes
- **icon:** add escaping inside icon registry
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **inline-editor:** fixes edit icon
- **inline-editor:** fixes IE issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **inline-editor:** model now updates only when save is pressed
- **inline-editor:** fixes issue when dt-errors are not passed to form-field
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **input:** fixes red outline in firefox
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **input:** fixes disabled background color
- **input:** fixes design issues
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **input:** fixes ie issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **loading-distractor:** added spinner
- **loading-spinner:** fixes animation when only spinner is used
- **loading-spinner:** fixes xml namespace issue for svg in angular core
- **progress-bar:** Fixes IE11 issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progress-circle:** fix path not being drawn correctly in IE
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progress-circle:** fixed getter calling setter and emitting event
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progress-circle:** scales icons in progress-circle
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **radio:** fixes issue when setting disabled directly
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** fixes valueChange emitting undefined when value zero has been set
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** removes themeable arrow icon in select
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** fixes multiline issue
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** fix chart in expandable table not being hidden correctly
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** fixed sort icon direction
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tag:** removed outside spacing
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **theming:** add missing blue colors
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **theming:** fixes issue where theme did not unsubscribe from parent properly
- **theming:** fixes theme inheritance
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **theming:** fixes issue when getting an error if there is no parent theme

### Features

- **alert:** added alert component
- **autocomplete:** added autocomplete
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** added button component
- **button:** added loading spinner for button
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** added nested variant
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **button:** added icon button
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **card:** added card component
- **chart:** added chart component
- **chart:** added heatfield & overload prevention capabilities
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added axis defaults for font size
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added support for area range
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added custom legend icons
- **chart:** added loading distractor to the chart
- **chart:** handles visibility without data
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** handles empty points inside tooltip
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added new color strategy and colors
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **chart:** added support for series and options as observables
- **chart:** added support for tooltip
- **cta-card:** added CTA card component
- **checkbox:** added checkbox component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **checkbox:** added dark theme
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **context-dialog:** added context dialog component
- **filter-field:** added filter-field
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **form-field:** added form-field component
- **icon:** added icon component and registry
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **icon:** added dt-iconpack support
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **icon:** added dt-iconpack integration
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **indicator:** added indicator component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **input:** added input directive
- **input, form-field:** added autofill monitor
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **loading-distractor:** added loading-distractor component
- **option:** added option component; to be used in other components such as
  select ([***REMOVED***](***REMOVED***/***REMOVED***))
- **overlay:** added overlay component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **progress-circle:** added progress-circle
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **radio:** added radio
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **select:** added select component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **selection-area:** added selection-area
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** added table component
- **table:** added problem indicator capabilities
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** added sorting capabilities
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **table:** added sticky header
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tabs:** added tabs
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **theming:** added theming
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **tile:** added tile component
- **tile:** added icons to tile
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **toast:** added toast component
  ([***REMOVED***](***REMOVED***/***REMOVED***))
- **viewport-resizer:** added viewport resizer
