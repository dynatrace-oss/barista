## 2.6.0 (2019-04-23)

### Bug Fixes

* **chart:** Fixes issue where tooltip was not updated if parent was set to onPush 
* **table:** Fixes an issue where cells were not reacting to sortable columns being removed 

### Features

* **key-value-list:** Added input to enable specifying number of columns ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **pagination:** Added possibility to setup pagination based on item count and page size ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **pagination:** Improved a11y
* **table:** Added a DtTableDatasource and DtSimpleColumn types for easier table usage ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks
Dorota Zaranska


## 2.5.0 (2019-04-15)

### Bug Fixes

* **chart:** Fixes an issue with tooltip flickering ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** Fixes an issue that the tooltip was not positioned correctly for category axis, correctly positions tooltip now vertically centered for all chart types except pie charts ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** Fixes chart changing colors on second render sometimes ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **context-dialog:** The close button's ARIA label can now be set as input ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **overlay:** Fixes an issue where the overlay was not closed when backdrop was clicked in pinned mode ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **overlay:** Fixes an issue where the CD was not triggered correctly when mousevents were handled on the trigger ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **filter-field:** Filter tags can now be accessed and disabled. 
* **linting:** Add a dt-checkbox-alt-text rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add copy-to-clipboard and toggle-button-item rules ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-card-needs-content rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-card-needs-title rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-info-group-needs-title-and-icon rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-loading-distractor-no-empty rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-radio-button-alt-text rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-show-more-no-empty rule and refactor text alternative check ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-tab-content-no-empty rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add dt-tab-label-no-empty rule ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add no-empty rules for switch, tag and tile components ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add rules to ensure that a dt-tile contains all required content elements ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add rules to find direct children of dt-card and dt-tile ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Add text alternative rule for selection area ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 2.4.0 (2019-04-05)

### Bug Fixes

* **chart:** Fixes missing highcharts logs on server for dt-chart ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field, input-field:** Fixes missing background color ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Fixes issue where more than one dt-icon elements are not allowed in a dt-icon-button ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **linting:** Fixes issue where dt-button linting rule does only allow text but no child components ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **toggle-button:** Fixes wrong border width ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **highlight:** Added dt-highlight component for marking terms in text ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 2.3.0 (2019-04-01)

### Bug Fixes

* **filter-field:** Fixes an issue where autocomplete panel is not closed when pressing the escape key ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **overlay:** Fixes an issue where the DtOverlay could no longer handle SVG elements as origins due to a `@angular/cdk` update and instance checks. Note this forces us to increase the peerDependency to at least 7.3.0 of the `@angular/cdk` package.
* **overlay:** Fixes an issue where the overlay would refocus an element. This caused a scrolling issue with elements that were focused outside the viewport ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** Moved multi expand property from row to table and deprecated `multi` property on expandable row ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features
* **table:** Expand state of a row can be set programmatically ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 2.2.0 (2019-03-18)

### Bug Fixes

* **filter-field:** Fixes an issue where the suggestion list could not be filtered and stayed visible even without suggestions ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** Fixes an issue where the autocomplete could overlap other parts of the page although the filter field input was not visible. Page level scrolling is now blocked when the filter field's autocomplete is open ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **linting:** Adds setup to ship angular-components specific a11y and usage linting rules ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks
Bernd Farka

## 2.1.0 (2019-03-12)


### Bug Fixes

* **autocomplete:** Fixes optionSelections not being emitted when the list of options changes 
* **bundle:** Bumped peer dependency version for dt-iconpack 
* **card:** Fixes card title and card-subtitle sizing 
* **filter-field:** Added missing filters property in filter changes event 
* **filter-field:** Fixes an issue where the filter field was not reset correctly when a filter was removed ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** Fixes an issue where the filters could not be removed if all options were already selected ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** Fixes an issue where the input reset would trigger to early and stop further progress 
* **filter-field:** Fixes issues with streams inside the filter field ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **icon:** Downgrades icon error to warning ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** Expandable trigger focus no longer gets cut off ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **toggle-button-group:** Fixed hover and active color on toggle-button-group-items ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


### Features

* **filter-field:** Added possibility to filter autocomplete options by their view value 

## 2.0.0 (2019-03-05)

### Breaking Changes

* **alert:** Uniontype `DtAlertSeverity` is no longer available for input severity. Use `'error'` or `'warning'` instead.
* **alert:** Input severity no longer takes `undefined` as a value for hiding the alert. Use `'error'` or `'warning'` for severity values and `*ngIf` to show or hide it. 
```html
<dt-alert *ngIf="isVisible" severity="warning">...</dt-alert>
```
* **card:**: The `<dt-card-actions>` component is no longer available. Use `<dt-card-title-actions>` instead.
* **chart:** The constant `CHART_COLOR_PALETTE_ORDERED` has been renamed to `DT_CHART_COLOR_PALETTE_ORDERED`.
* **chart:** The constant `CHART_COLOR_PALETTES` has been renamed to `DT_CHART_COLOR_PALETTES`.
* **core:** The enum `Colors` has been renamed to `DtColors`
* **key-value-list:** The key and value inputs on the item have been removed. Use the `dt-key-value-list-key` and `dt-key-value-list-value` elements instead.
```html
<dt-key-value-list>
  <dt-key-value-list-item *ngFor="let entry of entries">
    <dt-key-value-list-key>{{ entry.key }}</dt-key-value-list-key>
    <dt-key-value-list-value>{{ entry.value }}</dt-key-value-list-value>
  </dt-key-value-list-item>
<dt-key-value-list>
```
* **logger:** The value `WARN` for the enum DtLogLevel has been renamed to `WARNING`.
* **micro-chart:** Uniontype `DtMicroChartSeries` is no longer available for the series input. Use `Observable<DtChartSeries[]>`, `Observable<DtChartSeries>`, `DtChartSeries[]` or `DtChartSeries` instead.
* **table:** `<dt-expandable-cell>` is now required if you use a `<dt-expandable-row>`.

### Features

* **filter-field:** Added DataSource as main API entry point ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** Added support for distinct values in default data source ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** Expandable row trigger moved to dt-expandable-cell instead of whole row ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


## 1.8.3 (2019-03-04)

### Bug Fixes

* **autocomplete:** fixes custom panel classes are not set 
* **chart, selection-area:** fixes an issue where the highcharts instance would be updated after it has been destroyed ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes an issue where the position of the selection area on the chart was not correct ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes an issue where the selection-area-container was moved to the content of the parent component, if the parent used ng-content ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes the issue that the overlay of the selection area pushed itself on the screen ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 1.8.2 (2019-02-25)

### Bug Fixes

* **info-group:** adds support for being used inside a dt-table ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **micro-chart:** fixes `markers` default option for micro-charts ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** fixes styling for sorting when rows are added dynamically ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **tile:** fixes border styling to fully fit design specifications ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Deprecations
**info-group-cell**: Use info-group instead ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


## 1.8.1 (2019-02-18)

### Bug Fixes

* **chart:** adds default options for no utc time and marker disabling ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **copy-to-clipboard:** fixes background color for copy to clipboard input field on dark background ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **loading-distractor:** fixes font-weight of loading distractor label ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes cursor not being correct ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes issue that events where captured on plotbackground rather than an eventlayer on top ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes issue that overlay was not pushing itself on the screen horizontally ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes issue that selection area was created on mousedown rather than on mousemove ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table, chart:** fixes chart not shrinking in expandable table row ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** fixes overlay positioning when opening to the right and sticking outside of the screen ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


## 1.8.0 (2019-02-12)

### Bug Fixes

* **chart:** fixes rendering issue in highcharts ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **context-dialog:** fixes issue where context dialog only opens to the left ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** fixes size of select in IE11 ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table-with-sorting:** fixes IE11 not displaying sort header correctly ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **info-group:** adds new info group component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **micro-chart:** add option to interpolate data gaps and show it with a different visual style ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks 
Dominik Messner, Rene Panzar


## 1.7.1 (2019-02-05)

### Bug Fixes

* **table, tree-table:** fixes issue where table or tree-table is not fully rendered in AOT mode 


## 1.7.0 (2019-02-04)

### Bug Fixes

* **schematics:** fixes dt-component schematic to fit new lib structure ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


### Features

* **table, info-group-cell:** adds info-group-cell component that provides proper styling for two lines and an icon inside a table cell ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **toggle-button-group:** add toggle-button-group ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **tree-table:** add tree table component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 1.6.2 (2019-01-31)

### Bug Fixes

* **link:** removes extend-dependency in styles for better compatibility with newer sass versions ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 1.6.1 (2019-01-25)


### Bug Fixes

* **breadcrumbs:** fixes issue where arrow is not styled correctly 
* **filter-field:** fixes change event not beeing emitted when removing node ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 1.6.0 (2019-01-24)

### Bug Fixes

* **button:** fixes icon button not working with anchor tags ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **card, cta-card:** fixes spacing issue between content and footer actions ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **radio:** fixes underlying label not expanding to width of radio button 

### Features

* **breadcrumbs:** added color input to breadcrumbs, they now accept `main`, `error` or `neutral`. ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **theming:** added neutral variation to themes ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***)


## 1.5.1 (2019-01-21)

### Bug Fixes

* **bar-indicator:** fixes broken internal styling ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

## 1.5.0 (2019-01-18)

### Bug Fixes

* **switch:** fixes colors on dark background ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** fixes font weight for table's empty state ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **typography:** updated styles for h1-h3 headlines ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


### Features

* **bar-indicator:** added bar-indicator component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **drawer:** added basic drawer component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks 
Katrin Freihofner, Thomas Heller, Lara Aigmueller, Lukas Holzer


## 1.4.0 (2019-01-16)

### Bug Fixes

* **btn-group:** fixes broken responsive behavior on small screen ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **card, cta-card:** fixes spacing between action buttons ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **checkbox:** fixes issue when disabled attribute is set without a value ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** fixes sorted cells not beeing bold like in the header cell ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **toast:** fixes subsequent toasts not being shown immidiately after the previous toast disappears ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


### Features

* **colors:** added missing colors definition to DtColors ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **inline-editor:** added keyboard support for save and cancel ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks 
Ramon Arenal, Bartosz Bobin, Lukas Holzer, Katrin Freihofner


## 1.3.0 (2019-01-09)

### Bug Fixes

* **button:** added active style for nested buttons in the dark theme ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **switch:** fixes switch styles to fit the styleguide ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **colors:** add missing colors definition (red, green, shamrockgreen) to DtColors ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **card:** added card footer actions ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **charts:** added function for selecting color palette based on nrOfMetrics and Theme ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Deprecations

* **card:** `dt-card-actions` has been replaced with `dt-card-title-actions`

### Special Thanks 
Katrin Freihofner, Thomas Heller, Bartosz Bobin


## 1.2.1 (2019-01-02)

### Bug Fixes

* **microchart:** fixes dt-tooltip with microchart ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart, microchart:** fixes dt-tooltip not working when used in an app built with the prod flag ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))


## 1.2.0 (2018-12-20)

### Bug Fixes

* **chart:** make tooltip positioning more resilient to highcharts ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **micro-chart:** improved highcharts default options ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **micro-chart:** improved colors and fixed theming ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features
* **micro-chart:** added possibility to format labels ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks  
Alexander Lagler, Manfred Del Fabro


## 1.1.0 (2018-12-20)

### Bug Fixes

* **chart:** fixes issue where tooltip did not work with single metric data from highcharts ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** fixes positioning of the selection area element if a parent has position relative([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Features

* **key-value-list:** Added possibility to use html for key and value ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **progressbar:** Added description and count capabilities ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** Added interactiveRows property to table which makes the rows interactive(hover) ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))

### Special Thanks  
Bartosz Bobin, Thomas Heller, Luca Liguori


## 1.0.0 (2018-12-18)

### Bug Fixes

* **alert:** Replaced inline svg with dtIcons ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **autocomplete:** fixes dynamically changing autocompletes ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **breadcrumb:** remove router dependency ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes removes theming capabilities for main active theme color on button ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes button active issue in IE11+ ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes icon container change detection issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes icon size in buttons ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes missing styles on anchor ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes nested button background issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes existing icon container when icon has been removed ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** fixes superscript issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **card:** fixes wrong spacing on icon
* **card:** removes outer spacing (margin) ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added correct font
* **chart:** added default global options ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** Added loading text to make it i18n compatible ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** fixes issue that options where mutated instead of cloned
* **chart:** corrected easing functions overshoot ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** fixed chart area icon 
* **chart:** fixed chart blue theme ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** fixed legend overrides 
* **chart:** fixed legend sizing, coloring, disabled 
* **chart:** fixed no options/series passed 
* **chart:** fixed reflow issue
* **chart:** fixes for pie chart coloring ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** fixes missing legendicons when building an app with the prod flag ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** fixes tooltip not being wrapped when changing options at runtime ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***)) 
* **chart:** remove all change-detection cycles that were triggered by highcharts events 
* **chart:** fixes subscription cleanup on destroy ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** update chart selection model ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** use lodash merge function to deeply mergeClone options ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **checkbox:** disable animation timing in IE ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **checkbox:** fixes container size issue in non border-box environments ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **context-dialog:** added spacing for closing btn, improved focus management
* **context-dialog:** fixes issue where context-dialog does not close on blur ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **core:** rename log level name for consistency ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **expandable-section, expandable-panel:** Changed inline svg to dtIcon ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **expandable-section, expandable-panel:** fixes issue where openedChange does not fire when opened property is set
* **expandable-section, expandable-panel:** fixes issue where openedChange subscription is not unsubscribed
* **filter-field:** fixes broken nested button override ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** handle input keyup only on free text ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **filter-field:** node removal on backspace ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **formatters:** added chaining capabilities ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **formatters:** make pipes more resilient to strange input ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **form-field:** fixes spacing of error messages ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **form-field:** fixes issue where error element is overlapped ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **form-field:** fixes multiple styling issues with icons and buttons 
* **icon:** fixes issue where icons are loaded multiple times ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **icon:** changed icon color to white on darkthemes
* **icon:** add escaping inside icon registry ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***)) 
* **inline-editor:** fixes edit icon 
* **inline-editor:** fixes IE issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **inline-editor:** model now updates only when save is pressed 
* **inline-editor:** fixes issue when dt-errors are not passed to form-field ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **input:** fixes red outline in firefox ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **input:** fixes disabled background color 
* **input:** fixes design issues ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **input:** fixes ie issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **loading-distractor:** added spinner
* **loading-spinner:** fixes animation when only spinner is used 
* **loading-spinner:** fixes xml namespace issue for svg in angular core 
* **progress-bar:** Fixes IE11 issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **progress-circle:** fix path not being drawn correctly in IE ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **progress-circle:** fixed getter calling setter and emitting event ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **progress-circle:** scales icons in progress-circle ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **radio:** fixes issue when setting disabled directly ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** fixes valueChange emitting undefined when value zero has been set ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** removes themeable arrow icon in select ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** fixes multiline issue ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** fix chart in expandable table not being hidden correctly ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** fixed sort icon direction ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **tag:** removed outside spacing ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **theming:** add missing blue colors ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **theming:** fixes issue where theme did not unsubscribe from parent properly
* **theming:** fixes theme inheritance ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **theming:** fixes issue when getting an error if there is no parent theme 


### Features

* **alert:** added alert component
* **autocomplete:** added autocomplete ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** added button component
* **button:** added loading spinner for button ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** added nested variant ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **button:** added icon button ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **card:** added card component 
* **chart:** added chart component 
* **chart:** added heatfield & overload prevention capabilities ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added axis defaults for font size ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added support for area range ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added custom legend icons 
* **chart:** added loading distractor to the chart 
* **chart:** handles visibility without data ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** handles empty points inside tooltip ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added new color strategy and colors ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **chart:** added support for series and options as observables
* **chart:** added support for tooltip 
* **cta-card:** added CTA card component
* **checkbox:** added checkbox component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **checkbox:** added dark theme ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **context-dialog:** added context dialog component
* **filter-field:** added filter-field ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **form-field:** added form-field component 
* **icon:** added icon component and registry ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **icon:** added dt-iconpack support ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **icon:** added dt-iconpack integration ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **indicator:** added indicator component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **input:** added input directive
* **input, form-field:** added autofill monitor ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **loading-distractor:** added loading-distractor component
* **option:** added option component; to be used in other components such as select ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **overlay:** added overlay component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **progress-circle:** added progress-circle ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **radio:** added radio ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **select:** added select component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **selection-area:** added selection-area ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** added table component
* **table:** added problem indicator capabilities ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** added sorting capabilities ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **table:** added sticky header ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **tabs:** added tabs ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **theming:** added theming ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **tile:** added tile component
* **tile:** added icons to tile ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **toast:** added toast component ([***REMOVED***](https://dev-jira.dynatrace.org/browse/***REMOVED***))
* **viewport-resizer:** added viewport resizer 
