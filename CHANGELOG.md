# 1.0.0 (2018-12-18)


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
